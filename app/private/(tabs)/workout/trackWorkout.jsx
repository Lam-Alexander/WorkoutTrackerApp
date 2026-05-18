import { StyleSheet, View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../lib/supabase";

const trackWorkout = () => {
  const [exerciseName, setExerciseName] = useState([]);
  const { workoutLogId } = useLocalSearchParams();

  // console.log("trackWorkout:", workoutLogId);

  const hardCodedId = "0db442da-cdcc-4781-90a4-7822e3a01764";

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
          `
        id, 
        workout_log_id,
        exercise_log_order_idx,
        exercise_template (
        exercise_template_name
        )
        `,
        )
        // .eq("workout_log_id", workoutLogId)
        .eq("workout_log_id", hardCodedId)
        .order("exercise_log_order_idx", { ascending: true });

      if (exerciseLogError) {
        console.log("Error", exerciseLogError.message);
      }
      // console.log(JSON.stringify(exerciseLogData, null, 2));
      // setExerciseName(exerciseLogData)

      const formattedData = exerciseLogData.map((ex) => ({
        exerciseId: ex.id,
        excerciseIdx: ex.exercise_log_order_idx,
        exerciseName: ex.exercise_template.exercise_template_name,
      }));
      // console.log(formattedData);
      setExerciseName(formattedData);
    };
    fetchData();

    //   {
    //     "id": "0569180c-0169-47ab-b890-c7efb08c7315",
    //     "workout_log_id": "491c389b-43a5-495f-b6cc-f69bf0b99183",
    //     "exercise_log_order_idx": 1,
    //     "exercise_template": {
    //       "exercise_template_name": "One"
    //     }
    //   },
    //   {
    //     "id": "de8e0eb5-d2c2-4316-ba82-4c65f5d03dbf",
    //     "workout_log_id": "491c389b-43a5-495f-b6cc-f69bf0b99183",
    //     "exercise_log_order_idx": 2,
    //     "exercise_template": {
    //       "exercise_template_name": "Two"
    //     }
    //   }
  }, []);

  // console.log(JSON.stringify(exerciseName, null, 2));

  return (
    <ScrollView>
      <View>
        {exerciseName.map((ex) => (
          <View key={ex.exerciseId} style={styles.exerciseContainer}>
            <View>
              <Text>{ex.exerciseName}</Text>
            </View>
            <View>
              <Text>Track lifted weight</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Set</Text>
              <Text>Prev</Text>
              <Text>Reps</Text>
              <Text>Weight</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default trackWorkout;

const styles = StyleSheet.create({
  exerciseContainer: {
    margin: 25,
    backgroundColor: "#FCFCFC",
    padding: 15,
    borderRadius: 16,
  },
});
