import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import SelectableBox from "../../../../components/shared/SelectableBox";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { useSession } from "../../../../context/SessionContext";
import { useFocusEffect } from "expo-router";
import {
  PersonStanding,
  Shield,
  MoveDiagonal2,
  SlidersHorizontal,
  ArrowRight,
  BicepsFlexed,
  Info,
} from "lucide-react-native";

const iconMap = {
  Shield: Shield,
  PersonStanding: PersonStanding,
  MoveDiagonal2: MoveDiagonal2,
  BicepsFlexed: BicepsFlexed,
};

const workout = () => {
  const [loading, setLoading] = useState(false);
  const [workoutTemplate, setWorkoutTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const router = useRouter();
  const session = useSession();

  useFocusEffect(
    useCallback(() => {
      const fetchTemplateData = async () => {
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
          return;
        }

        const formattedTemplateData = data.map((template) => ({
          templateId: template.id,
          templateName: template.workout_template_name,
          templateIcon: iconMap[template.workout_template_icon] ?? BicepsFlexed,

          exercises: template.exercise_template.map((exercise) => ({
            exerciseId: exercise.id,
            exerciseName: exercise.exercise_template_name,
            exerciseIdx: exercise.exercise_template_order_idx,
          })),
        }));

        setWorkoutTemplate(formattedTemplateData);
      };

      fetchTemplateData();
    }, [session.session?.user.id]),
  );

  const startWorkout = async () => {
    if (!selectedTemplate) {
      Alert.alert("Please select a template");
      return;
    }

    // setLoading(true);

    const userId = session.session.user.id;
    const templateId = selectedTemplate.templateId;

    const { data: workoutLogData, error: workoutLogError } = await supabase
      .from("workout_log")
      .insert([
        {
          profile_id: userId,
          workout_template_id: templateId,
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
      return;
    }

    const workoutLogId = workoutLogData.id;

    const organizedData = selectedTemplate.exercises.map((ex) => ({
      workout_log_id: workoutLogId,
      exercise_template_id: ex.exerciseId,
      exercise_log_order_idx: ex.exerciseIdx,
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
      return;
    }

    router.push({
      pathname: "private/(tabs)/workout/trackWorkout",
      params: {
        workoutLogId: workoutLogId,
      },
    });
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
            <Text style={styles.title}>Choose your {"\n"}workout</Text>
            <View style={styles.dayPlanContainer}>
              <Text style={styles.dayPlanText}>Day plan</Text>
            </View>
          </View>
          <View>
            <Text style={styles.headerDescriptionText}>
              Pick the focus for today before adding your exercise and tracking
              reps
            </Text>
          </View>
        </View>
        <View style={styles.workoutSplitContainer}>
          <Text style={styles.workoutSplitTitle}>Workout Split</Text>
          <Text style={styles.workoutSplitDescription}>
            Start with a common split or choose a combined day when you want
            more variety.
          </Text>
          {workoutTemplate.length === 0 ? (
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
        </View>
        <View style={{ marginTop: 25 }}>
          <AppCustomButton
            title="Continue to Exercise"
            r
            disabled={workoutTemplate.length === 0}
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
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    paddingRight: 50,
    flexDirection: "row",
    gap: 10,
  },

  cardContainer: {
    backgroundColor: "#EAFBF7",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    textAlign: "center",
    flexShrink: 1,
  },

  headerDescriptionText: {
    fontSize: 16,
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
    fontSize: 32,
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
    fontSize: 16,
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
  },

  workoutSplitContainer: {
    backgroundColor: "white",
    marginHorizontal: 25,
    borderRadius: 12,
    paddingTop: 15,
    paddingBottom: 15,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android shadow
    elevation: 3,
  },

  workoutSplitTitle: {
    marginLeft: 25,
    fontSize: 24,
    fontWeight: "bold",
  },

  workoutSplitDescription: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 15,
    marginTop: 10,
  },
});
