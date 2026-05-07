import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useSession } from "../../../../context/SessionContext";
import { supabase } from "../../../../lib/supabase";

const createTemplate = () => {
  const [templateName, setTemplateName] = useState("");
  const [exerciseName, setExerciseName] = useState([]);

  const { session } = useSession();

  const handleCreateTemplate = async () => {
    if (!session) {
      console.log("No session found")
      return;
    }

    const handleAddProfile = await supabase
    .from("profile")
    .insert([
      {
        id: session.user.id,
        profile_name: session.user.user_metadata.display_name
      }
    ])

    const handleAddTemplate = await supabase
    .from("workout_template")
    .insert([
      {
        profile_id:session.user.id,
        workout_template_name: templateName
      }
    ])
    .select()
    .single()

    const workout_template = handleAddTemplate.data
    const error = handleAddTemplate.error

    if (error) {
      console.error(error)
      return;
    }
    console.log(workout_template)
  }

  return (
    <View>
      <Text>createTemplate</Text>
      <TextInput
      style={{borderColor:"grey",
        borderWidth: 1,
        height: 40,
        paddingHorizontal:10,
        marginTop: 10
      }}
      placeholder="hello"
      value={templateName}
      onChangeText={(e) => setTemplateName(e)}
      />
      <Button
      title="submit"
      onPress={handleCreateTemplate}
      />
    </View>
  );
};

export default createTemplate;
