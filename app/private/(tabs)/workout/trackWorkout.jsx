import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";


const trackWorkout = () => {
  const { workoutLogId } = useLocalSearchParams()
  console.log("trackWorkout:",workoutLogId)
  return (
    <View>
      <Text>trackWorkout</Text>
    </View>
  );
};

export default trackWorkout;
