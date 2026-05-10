import { View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
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

    const cleanedExerciseName = exerciseName
      .map((exercise) => exercise.trim())
      .filter((exercise) => exercise !== "");

    if (templateName.trim() === "") {
      Alert.alert("Template name is required");
      return;
    }

    if (cleanedExerciseName.length === 0) {
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

    const formattedExerciseName = exerciseName.map((exercises, index) => ({
      workout_template_id: data.id,
      exercise_template_name: exercises,
      exercise_template_order_idx: index + 1,
    }));

    const { error: exerciseError } = await supabase
      .from("exercise_template")
      .insert(formattedExerciseName);

    if (exerciseError) {
      console.log("Error", exerciseError.message);
      return;
    }
    setExerciseName([""]);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>createTemplate</Text>
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
          <Button title="Add Template" onPress={handleCreateWorkoutTemplate} />
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default createWorkoutTemplate;
