import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useSession } from "../../../../context/SessionContext";
import { supabase } from "../../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trash2 } from "lucide-react-native";

const createWorkoutTemplate = () => {
  const { session } = useSession();
  const [templateName, setTemplateName] = useState<string>("");
  const [exercise, setExercise] = useState([{ name: "", target: "" }]);
  // const [exerciseTarget, setExerciseTarget] = useState<string>("");

  const addExerciseField = () => {
    setExercise((prev) => [...prev, { name: "", target: "" }]);
  };

  const handleExerciseNameChange = (text: string, index: number) => {
    const updatedExercise = [...exercise];
    updatedExercise[index].name = text;
    setExercise(updatedExercise);
  };

  const handleExerciseTargetChange = (text: string, index: number) => {
    const updatedExercise = [...exercise];
    updatedExercise[index].target = text;
    setExercise(updatedExercise);
  };

  const handleRemoveExercise = (index: number) => {
    const newArr = exercise.filter((_, i) => i !== index);
    setExercise(newArr);
  };

  const handleCreateWorkoutTemplate = async () => {
    if (!session) {
      Alert.alert("No session found");
      return;
    }

    const trimmedNonEmptyExercises = exercise
      .map((exercise) => exercise.name.trim())
      .filter((exercise) => exercise !== "");

    if (templateName.trim() === "") {
      Alert.alert("Template name is required");
      return;
    }

    if (trimmedNonEmptyExercises.length === 0) {
      Alert.alert("Add at least one exercise");
      return;
    }

    const { error, data, status } = await supabase
      .from("workout_template")
      .insert([
        {
          profile_id: session.user.id,
          workout_template_name: templateName,
        },
      ])
      .select()
      .single();

    if (error) {
      Alert.alert(
        "Saved Failed",
        "There was a problem saving your workout. Please try again",
      );
      return;
    }

    if (status === 201) {
      Alert.alert("Successfully Added");
    }
    console.log(data);
    setTemplateName("");

    const formattedExerciseTemplateData = exercise.map(
      (exercises, index, exerciseTarget) => ({
        workout_template_id: data.id,
        exercise_template_name: exercises,
        exercise_template_order_idx: index + 1,
      }),
    );

    const { error: exerciseError } = await supabase
      .from("exercise_template")
      .insert(formattedExerciseTemplateData);

    if (exerciseError) {
      console.log("Error", exerciseError.message);
      return;
    }
    setExercise([{ name: "", target: "" }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        <View style={styles.margin}>
          <View>
            <View style={styles.templateSetupContainer}>
              <Text style={styles.templateSetupText}>Template Setup</Text>
            </View>
            <View>
              <Text style={styles.headerTitleText}>
                Create your workout template
              </Text>
            </View>
            <View>
              <Text style={styles.headerDescriptionText}>
                Pick the focus for today before adding your exercise and
                tracking reps
              </Text>
            </View>
          </View>
          <View>
            <View style={styles.workoutSplitContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}
              >
                1. Pick the workout day
              </Text>
              <Text style={{ color: "#486895" }}>
                Choose a preset like push, pull, legs or add your own custom
                name
              </Text>
              <View>
                <TextInput
                  style={{
                    borderColor: "grey",
                    borderWidth: 1,
                    height: 40,
                    paddingHorizontal: 10,
                    marginTop: 10,
                  }}
                  placeholder="Template Name"
                  value={templateName}
                  onChangeText={(text) => setTemplateName(text)}
                />
              </View>
            </View>
          </View>

          <View>
            <View style={styles.workoutSplitContainer}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8 }}
              >
                2. Add your exercise
              </Text>
              <Text style={{ color: "#486895" }}>
                Choose a preset like push, pull, legs or add your own custom
                name
              </Text>
              <View>
                {exercise.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      // marginBottom: 10,
                      marginVertical: 15,
                      backgroundColor: "#F1F5F9",
                      padding: 15,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 25,
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontSize: 16, fontWeight: "500" }}>
                        Exercise {index + 1}
                      </Text>
                      {/* <View
                        style={{
                          width: 30,
                          height: 30,
                          backgroundColor: "#E4EBF3",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 20,
                        }}
                      >
                        <Text style={{ fontWeight: 500 }}>{index + 1}</Text>
                      </View> */}
                      <Trash2
                        onPress={() => handleRemoveExercise(index)}
                        // style={{ marginHorizontal: 25 }}
                        color={"#6B7280"}
                      />
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ width: "100%", gap: 20 }}>
                        {/* EXERCISE INPUT */}
                        <TextInput
                          value={item.name}
                          onChangeText={(text) =>
                            handleExerciseNameChange(text, index)
                          }
                          placeholder={`Exercise ${index + 1}`}
                          style={{
                            flex: 1,
                            // borderColor: "gray",
                            height: 50,
                            borderWidth: 0,
                            padding: 8,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                        />

                        {/* TARGET INPUT */}
                        <TextInput
                          value={item.target}
                          onChangeText={(text) =>
                            handleExerciseTargetChange(text, index)
                          }
                          placeholder={"3 Sets of 8-12"}
                          style={{
                            flex: 1,
                            // borderColor: "gray",
                            height: 50,
                            borderWidth: 0,
                            padding: 8,
                            backgroundColor: "white",
                            borderRadius: 10,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                ))}
                <View>
                  <Button title="Add Exercise" onPress={addExerciseField} />
                </View>
              </View>
            </View>
          </View>

          <Button
            title="Save workout template"
            onPress={handleCreateWorkoutTemplate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default createWorkoutTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

  margin: {
    margin: 25,
    marginTop: 25,
  },

  headerTitleText: {
    fontSize: 32,
    fontWeight: "bold",
  },

  headerDescriptionText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginTop: 15,
  },

  templateSetupContainer: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  templateSetupText: {
    color: "#065F46",
    fontWeight: "600",
  },

  workoutSplitContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android shadow
    elevation: 3,
  },
});
