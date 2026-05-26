import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "", headerShown: false }} />
      <Stack.Screen
        name="createWorkoutTemplate"
        options={{ title: "", headerShown: false }}
      />
      <Stack.Screen
        name="trackWorkout"
        options={{ title: "", headerShown: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
