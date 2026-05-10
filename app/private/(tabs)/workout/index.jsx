import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useState } from "react";
import SelectableBox from "../../../../components/shared/SelectableBox";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { useSession } from "../../../../context/SessionContext";
import { useFocusEffect } from "expo-router";
import { BicepsFlexed, LucideIcon } from "lucide-react-native";
import {
  PersonStanding,
  Shield,
  MoveDiagonal2,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react-native";

const iconMap = {
  Shield: Shield,
  PersonStanding: PersonStanding,
  MoveDiagonal2: MoveDiagonal2,
  BicepsFlexed: BicepsFlexed
};

const workout = () => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [workoutTemplate, setWorkoutTemplate] = useState([]);
  // const [exercises, setExercises] = useState();
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
          })),
        }));

        // console.log(formattedTemplateData);
        setWorkoutTemplate(formattedTemplateData);
      };

      fetchTemplateData();
    }, [session.session?.user.id]),
  );

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleSubmit = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.margin}>
          <View>
            <Text
              style={[
                styles.defaultText,
                {
                  marginBottom: 15,
                },
              ]}
            >
              {today}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>Choose your {"\n"}workout</Text>
            <View style={styles.dayPlanContainer}>
              <Text style={styles.dayPlanText}>Day plan</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.defaultText, { marginTop: 15 }]}>
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
          {workoutTemplate.map((item, index) => (
            <SelectableBox
              key={item.templateId}
              icon={item.templateIcon}
              label={item.templateName}
              title={item.templateName}
              description={item.exercises
                .slice(0.5)
                .map((exercise) => exercise.exerciseName)
                .join(", ")}
              selected={selected === index}
              onPress={() => setSelected(selected === index ? null : index)}
            />
          ))}
        </View>
        <View style={{ marginTop: 25 }}>
          <AppCustomButton
            title="Continue to Exercise"
            onPress={() => router.push("/private/(tabs)/workout/trackWorkout")}
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

  defaultText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
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
    marginLeft: 10,
    marginRight: 10,
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
    fontSize: 20,
    fontWeight: "bold",
  },

  workoutSplitDescription: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 15,
  },
});
