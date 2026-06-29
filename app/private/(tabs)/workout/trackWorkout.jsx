import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { Plus, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const trackWorkout = () => {
  const [exercise, setExercise] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const { workoutLogId } = useLocalSearchParams();
  const navigation = useNavigation();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  console.log("Workout_Log_ID:", workoutLogId);

  useEffect(() => {
    const fetchData = async () => {
      const { data: exerciseLogData, error: exerciseLogError } = await supabase
        .from("exercise_log")
        .select(
          `id,
          workout_template_name,
          workout_log_id,
          exercise_log_order_idx,
          exercise_template (
            exercise_template_name,
            target_scheme
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

      setTemplateName(exerciseLogData[0]?.workout_template_name ?? "");

      const formattedData = exerciseLogData.map((ex) => ({
        exerciseId: ex.id,
        exerciseIdx: ex.exercise_log_order_idx,
        exerciseName: ex.exercise_template.exercise_template_name,
        exerciseTarget: ex.exercise_template.target_scheme,

        sets: ex.sets.map((set) => ({
          id: set.id,
          reps: String(set.reps ?? ""),
          weights: String(set.weights ?? ""),
          set_number: set.set_number,
        })),
      }));

      setExercise(formattedData);
    };
    fetchData();
  }, []);

  const handleCleanUpExerciseLog = async () => {
    const { error } = await supabase
      .from("workout_log",)
      .delete()
      .eq("id", workoutLogId);

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

  const confirmSaveWorkout = () => {
    Alert.alert(
      "End Workout?",
      "Do you want to complete the workout for today?",
      [
        { text: "No", style: "cancel" },
        { text: "yes", onPress: async () => await handleSaveSets() },
      ],
    );
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

    const hasInvalidValue = setsToInsert.some(
      (set) => !set.reps || !set.weights || set.reps < 0 || set.weight < 0,
    );

    if (hasInvalidValue) {
      Alert.alert(
        "Missing Reps or Weights",
        "Please enter valid numbers for reps and weight",
      );
      return;
    }
    const hasEmptySets = exercise.some(
      (ex) => !ex.sets || ex.sets.length === 0,
    );

    if (hasEmptySets) {
      Alert.alert("Missing sets", "Each exercise must have at least one set");
      return;
    }

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
            <Text style={styles.dateContainer}>{today}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.title}>
              Today's <Text style={{ color: "#2AD4B2" }}>Plan</Text>
            </Text>
            <View style={styles.dayPlanContainer}>
              <Text style={styles.dayPlanText}>{templateName} day</Text>
            </View>
          </View>
          <View>
            <Text style={[styles.headerDescription, { marginTop: 15 }]}>
              Record your sets, reps, and weight for today's session and track
              progress over time.
            </Text>
          </View>
        </View>
        <View>
          {exercise.map((ex, exerciseIdx) => (
            <View key={ex.exerciseId} style={styles.exerciseContainer}>
              <View>
                <Text style={styles.exerciseName}>{ex.exerciseName}</Text>
              </View>
              <View>
                <Text style={styles.exerciseSubtitle}>{ex.exerciseTarget}</Text>
              </View>

              <View style={[styles.row, styles.tableHeaderRow]}>
                <Text style={[styles.col, styles.setCol, styles.headerText]}>
                  Set
                </Text>
                <Text style={[styles.col, styles.headerText]}>Reps</Text>
                <Text style={[styles.col, styles.headerText]}>Weight</Text>
                <View style={styles.actionCol} />
              </View>

              {ex.sets.map((set, setIdx) => (
                <View key={setIdx} style={[styles.row, styles.setRow]}>
                  <Text style={[styles.col, styles.setCol, styles.setNumber]}>
                    {setIdx + 1}
                  </Text>

                  <TextInput
                    value={set.reps}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    style={[styles.col, styles.input]}
                    onChangeText={(text) =>
                      updateSetValue(exerciseIdx, setIdx, "reps", text)
                    }
                  ></TextInput>

                  <TextInput
                    value={set.weights}
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    style={[styles.col, styles.input]}
                    onChangeText={(text) =>
                      updateSetValue(exerciseIdx, setIdx, "weights", text)
                    }
                  ></TextInput>

                  <View style={styles.actionCol}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleRemoveSets(exerciseIdx, setIdx)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Trash2 size={16} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              <AppCustomButton
                title="Add set"
                icon={Plus}
                onPress={(text) => addSet(exerciseIdx)}
                buttonStyle={{ height: 40, marginHorizontal: 50 }}
              />
            </View>
          ))}
          <AppCustomButton
            title="Finish Workout"
            icon={Plus}
            onPress={confirmSaveWorkout}
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
    marginTop: 25,
    marginHorizontal: 25,
  },

  headerDescription: {
    fontSize: 14,
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

  exerciseContainer: {
    margin: 25,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,

    // Android shadow
    elevation: 0.2,
  },

  exerciseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  exerciseSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  tableHeaderRow: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },

  setRow: {
    // backgroundColor: "#F8FAFC",
    // backgroundColor: "#EFFFFC",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 10,
  },

  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },

  col: {
    flex: 1,
    textAlign: "center",
  },

  setCol: {
    flex: 0.6,
  },

  setNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  actionCol: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  input: {
    // borderColor: "transparent",
    borderColor: "#E2E8F0",
    // borderWidth: 0,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    textAlign: "center",
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
});
