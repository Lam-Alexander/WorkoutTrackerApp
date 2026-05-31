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

const createWorkoutTemplate = () => {
  const { session } = useSession();
  const [templateName, setTemplateName] = useState<string>("");
  const [exerciseName, setExerciseName] = useState<string[]>([""]);

  const addExerciseField = () => {
    setExerciseName((prev) => [...prev, ""]);
  };

  const handleExerciseChange = (text: string, index: number) => {
    const updatedExercise = [...exerciseName];
    updatedExercise[index] = text;
    setExerciseName(updatedExercise);
  };

  const handleRemoveExercise = (index: number) => {
    const newArr = exerciseName.filter((_, i) => i !== index);
    setExerciseName(newArr);
  };

  const handleCreateWorkoutTemplate = async () => {
    if (!session) {
      Alert.alert("No session found");
      return;
    }

    const trimmedNonEmptyExerciseNames = exerciseName
      .map((exercise) => exercise.trim())
      .filter((exercise) => exercise !== "");

    if (templateName.trim() === "") {
      Alert.alert("Template name is required");
      return;
    }

    if (trimmedNonEmptyExerciseNames.length === 0) {
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

    const formattedExerciseTemplateData = exerciseName.map(
      (exercises, index) => ({
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
    setExerciseName([""]);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            </View>
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

          {exerciseName.map((exercises, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <Text>Hello</Text>
              <Text>{index + 1}</Text>
              <TextInput
                value={exercises}
                onChangeText={(text) => handleExerciseChange(text, index)}
                placeholder={`Exercise ${index + 1}`}
                style={{
                  flex: 1,
                  borderColor: "gray",
                  height: 50,
                  borderWidth: 1,
                  padding: 8,
                }}
              />
              <Button onPress={() => handleRemoveExercise(index)} title="x" />
            </View>
          ))}
          <View>
            <Button title="Add Exercise" onPress={addExerciseField} />
          </View>
          <Button title="Add Template" onPress={handleCreateWorkoutTemplate} />
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
