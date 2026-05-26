import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";

import { Plus, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const trackWorkout = () => {
  const [exercise, setExercise] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const { workoutLogId } = useLocalSearchParams();
  const navigation = useNavigation();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const hardCodedId = "0db442da-cdcc-4781-90a4-7822e3a01764";

  console.log("Workout_Log_ID:", workoutLogId);

  /* trackWorkout page work flow
  ---------
  // 1. Fetch data from exercise logs using Join to display each workout
  // 2. Fetch sets so UI will dynamically up as user add more sets
  // 2. Map over data to get the exercise name to display
  // 3. Create an state array [""] so that user can input new sets
  // 4. Insert each set into the database
  //
  */

  useEffect(() => {
    const fetchData = async () => {
      const { data: exerciseLogData, error: exerciseLogError } = await supabase
        .from("exercise_log")
        .select(
          `id,
          workout_log_id,
          exercise_log_order_idx,
          exercise_template (
            exercise_template_name 
          ),

          sets(
            id,
            set_number,
            reps,
            weights,
            set_order_idx
          )
          `,
        )
        .eq("workout_log_id", workoutLogId)
        // .eq("workout_log_id", hardCodedId)
        .order("exercise_log_order_idx", { ascending: true });

      if (exerciseLogError) {
        console.log("Error", exerciseLogError.message);
      }

      const formattedData = exerciseLogData.map((ex) => ({
        exerciseId: ex.id,
        exerciseIdx: ex.exercise_log_order_idx,
        exerciseName: ex.exercise_template.exercise_template_name,

        sets:
          // ex.sets.length > 0
          ex.sets.map((set) => ({
            id: set.id,
            reps: String(set.reps ?? ""),
            weights: String(set.weights ?? ""),
            set_number: set.set_number,
          })),
        // : [
        //     {
        //       reps: "",
        //       weights: "",
        //       set_number: 1,
        //     },
        //   ],
      }));

      setExercise(formattedData);
    };
    fetchData();
  }, []);

  const handleCleanUpExerciseLog = async () => {
    const { error } = await supabase
      .from("exercise_log")
      .delete()
      .eq("workout_log_id", workoutLogId);

    if (error) {
      console.log("Error cleaning up exercise log", error.message);
    }
  };

  useEffect(() => {
    const unsubcribe = navigation.addListener("beforeRemove", (e) => {
      if (isSaved) {
        return;
      }

      e.preventDefault();

      Alert.alert(
        "Discard workout?",
        "You haven’t finished this workout. If you leave, it will be discarded.",
        [
          { text: "Continue", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: async () => {
              (await handleCleanUpExerciseLog(),
                navigation.dispatch(e.data.action));
            },
          },
        ],
      );
    });
    return unsubcribe;
  }, [navigation, isSaved]);

  const updateSetValue = (exerciseIdx, setIdx, field, value) => {
    const updatedSetValue = [...exercise];
    updatedSetValue[exerciseIdx].sets[setIdx][field] = value;
    setExercise(updatedSetValue);
  };

  const addSet = (exerciseIdx) => {
    const updatedExercise = [...exercise];
    updatedExercise[exerciseIdx].sets.push({
      reps: "",
      weights: "",
      set_number: updatedExercise[exerciseIdx].sets.length + 1,
    });

    setExercise(updatedExercise);

    // console.log(JSON.stringify(updatedExercise[0], null, 2));
  };

  const handleSaveSets = async () => {
    const setsToInsert = exercise.flatMap((ex) =>
      ex.sets.map((set, idx) => ({
        exercise_log_id: ex.exerciseId,
        set_number: idx + 1,
        reps: Number(set.reps),
        weights: Number(set.weights),
        set_order_idx: idx + 1,
      })),
    );

    // console.log(JSON.stringify(setsToInsert, null, 2));

    const { data, error } = await supabase
      .from("sets")
      .insert(setsToInsert)
      .select();

    console.log(JSON.stringify(data, null, 2));
    if (error) {
      console.log(error.message);
      Alert.alert("Error", "There was an error saving please try again");
      return;
    }
    setIsSaved(true);
    setExercise([]);
    router.dismissAll();
    router.replace("private/(tabs)/home");
  };

  const handleRemoveSets = (exIdx, setIdx) => {
    const updatedExercise = [...exercise];
    updatedExercise[exIdx].sets = updatedExercise[exIdx].sets.filter(
      (_, i) => i !== setIdx,
    );
    setExercise(updatedExercise);

    // console.log(JSON.stringify(updatedExercise, null, 2));
  };

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
          <View style={styles.headerRow}>
            <Text style={styles.title}>Today's Plan</Text>
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
        <View>
          {exercise.map((ex, exerciseIdx) => (
            <View key={ex.exerciseId} style={styles.exerciseContainer}>
              <View>
                <Text>{ex.exerciseName}</Text>
              </View>
              <View>
                <Text>Track lifted weight</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.col}>Set</Text>
                <Text style={styles.col}>Reps</Text>
                <Text style={styles.col}>Weight</Text>
                <Text style={[styles.col, styles.white]}>Delete</Text>
              </View>

              {ex.sets.map((set, setIdx) => (
                <View key={setIdx} style={[styles.row, styles.test]}>
                  <Text style={styles.col}>{setIdx + 1}</Text>

                  <TextInput
                    value={set.reps}
                    placeholder="rep"
                    style={[styles.col, styles.input]}
                    onChangeText={(text) =>
                      updateSetValue(exerciseIdx, setIdx, "reps", text)
                    }
                  ></TextInput>

                  <TextInput
                    value={set.weights}
                    placeholder="weight"
                    style={[styles.col, styles.input]}
                    onChangeText={(text) =>
                      updateSetValue(exerciseIdx, setIdx, "weights", text)
                    }
                  ></TextInput>
                  <Trash2
                    style={styles.col}
                    onPress={() => handleRemoveSets(exerciseIdx, setIdx)}
                  />
                </View>
              ))}
              <AppCustomButton
                title="Add set"
                icon={Plus}
                onPress={(text) => addSet(exerciseIdx)}
              />
            </View>
          ))}
          <AppCustomButton
            title="Finish Workout"
            icon={Plus}
            onPress={async () => {
              await handleSaveSets();
            }}
            colour={"default"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default trackWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

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

  headerRow: {
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

  exerciseContainer: {
    margin: 25,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android shadow
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  white: {
    color: "white",
  },

  col: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 6,
  },

  input: {
    borderColor: "gray",
    borderWidth: 0.2,
    borderRadius: 8,
    // backgroundColor: "#F8F9FB",
  },

  test: {
    backgroundColor: "#EFFFFC",
    flex: 1,
    padding: 15,
  },
});
