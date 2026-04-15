import { Slot, Stack } from "expo-router";
import { SessionProvider } from "../context/SessionContext";

export default function Layout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen
          name="auth"
          options={{
            title: "",
            // This is responabile for the black and white header in get auth
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
}
