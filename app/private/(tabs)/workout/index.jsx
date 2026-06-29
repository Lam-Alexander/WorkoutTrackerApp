import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import SelectableBox from "../../../../components/shared/SelectableBox";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { useSession } from "../../../../context/SessionContext";
import { useFocusEffect } from "expo-router";
import { SlidersHorizontal, ArrowRight, Info } from "lucide-react-native";
import { iconMap, DEFAULT_WORKOUT_ICON } from "./createWorkoutTemplate";

const workout = () => {
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [workoutTemplate, setWorkoutTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const router = useRouter();
  const session = useSession();

  useFocusEffect(
    useCallback(() => {
      const userId = session.session?.user?.id;
      if (!userId) return;

      const fetchTemplateData = async () => {
        setIsFetching(true);

        const { data, error } = await supabase
          .from("workout_template")
          .select(
            `id,
            workout_template_name,
            workout_template_icon,
            exercise_template ( 
              id,
              exercise_template_name,
              exercise_template_order_idx
            )`,
          )
          .eq("profile_id", session.session?.user.id);

        if (error) {
          console.log("Error", error.message);
          setIsFetching(false);
          return;
        }

        const formattedTemplateData = data.map((template) => ({
          templateId: template.id,
          templateName: template.workout_template_name,
          templateIcon:
            iconMap[template.workout_template_icon] ??
            iconMap[DEFAULT_WORKOUT_ICON],

          exercises: template.exercise_template.map((exercise) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.exercise_template_name,
            exerciseIdx: exercise.exercise_template_order_idx,
          })),
        }));

        setWorkoutTemplate(formattedTemplateData);
        setIsFetching(false);
      };

      fetchTemplateData();
    }, [session.session?.user.id]),
  );

  const startWorkout = async () => {
    if (!selectedTemplate) {
      Alert.alert("Please select a template");
      return;
    }

    setLoading(true);

    const userId = session.session.user.id;
    const templateId = selectedTemplate.templateId;
    const templateName = selectedTemplate.templateName;

    const { data: workoutLogData, error: workoutLogError } = await supabase
      .from("workout_log")
      .insert([
        {
          profile_id: userId,
          workout_template_id: templateId,
          workout_template_name: templateName,
          workout_date: new Date().toDateString(),
        },
      ])
      .select()
      .single();

    if (workoutLogError) {
      Alert.alert(
        "Error",
        "There was an issue starting the workout, Please try again",
      );
      console.log(workoutLogError.message);
      setLoading(false);
      return;
    }

    const workoutLogId = workoutLogData.id;

    const organizedData = selectedTemplate.exercises.map((ex) => ({
      workout_log_id: workoutLogId,
      exercise_template_id: ex.exerciseId,
      exercise_log_order_idx: ex.exerciseIdx,
      exercise_name: ex.exerciseName,
      workout_template_name: templateName,
    }));

    const { data: exerciseLogData, error: exerciseLogError } = await supabase
      .from("exercise_log")
      .insert(organizedData)
      .select();

    if (exerciseLogError) {
      Alert.alert(
        "Error",
        "There was an issue starting workout, Please try again",
      );
      console.log(exerciseLogError.message);
      setLoading(false);
      return;
    }

    router.push({
      pathname: "private/(tabs)/workout/trackWorkout",
      params: {
        workoutLogId: workoutLogId,
      },
    });
    setLoading(false);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        <View style={styles.margin}>
          <View>
            <Text style={styles.dateContainer}>{today}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>
              Choose your <Text style={{ color: "#2AD4B2" }}>Workout</Text>
            </Text>
            {/* <View style={styles.dayPlanContainer}>
              <Text style={styles.dayPlanText}>Day plan</Text>
            </View> */}
          </View>
          <View>
            <Text style={styles.headerDescriptionText}>
              Pick the focus for today before adding your exercise and tracking
              reps
            </Text>
          </View>
        </View>

        {isFetching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2AD4B2" />
          </View>
        ) : workoutTemplate.length === 0 ? (
          <View style={styles.cards}>
            <Info size={25} color="#2AD4B2" />

            <Text style={{ fontWeight: 500 }}>
              You don’t have any workout templates yet. Create one to get
              started.
            </Text>
          </View>
        ) : (
          workoutTemplate.map((item, index) => (
            <SelectableBox
              key={item.templateId}
              icon={item.templateIcon}
              label={item.templateName}
              title={item.templateName}
              description={item.exercises
                .slice(0, 3)
                .map((exercise) => exercise.exerciseName)
                .join(", ")}
              selected={selectedTemplate?.templateId === item.templateId}
              onPress={() =>
                setSelectedTemplate(
                  selectedTemplate?.templateId === item.templateId
                    ? null
                    : item,
                )
              }
            />
          ))
        )}
        {/* </View> */}
        <View style={{ marginTop: 25 }}>
          <AppCustomButton
            title="Continue to Exercise"
            disabled={workoutTemplate.length === 0 || loading}
            onPress={startWorkout}
            icon={ArrowRight}
            colour={"default"}
          />
        </View>

        <View style={{ marginTop: 25, marginBottom: 25 }}>
          <AppCustomButton
            title="Build custom workout"
            onPress={() =>
              router.push("/private/(tabs)/workout/createWorkoutTemplate")
            }
            icon={SlidersHorizontal}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default workout;

const styles = StyleSheet.create({
  margin: {
    margin: 25,
    marginTop: 25,
  },

  cards: {
    backgroundColor: "#EAFBF7",
    marginHorizontal: 25,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    paddingRight: 50,
    flexDirection: "row",
    gap: 10,
  },

  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },

  headerDescriptionText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginTop: 15,
  },

  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  dateContainer: {
    marginBottom: 15,
    backgroundColor: "#F1F5F9",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "#6B7280",
    fontSize: 12,
    fontWeight: 500,
  },

  dayPlanContainer: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  dayPlanText: {
    color: "#065F46",
    fontWeight: "600",
    fontSize: 12,
  },
});
