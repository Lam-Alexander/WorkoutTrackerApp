import { Slot, Stack } from "expo-router";
import { SessionProvider } from "../context/SessionContext";

export default function Root_Layout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen
          name="public"
          options={{
            title: "",
            headerTintColor: "#2AD4B2",
          }}
        />
        <Stack.Screen name="private" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
