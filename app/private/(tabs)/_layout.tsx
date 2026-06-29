import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { House, Dumbbell, ChartColumn, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6FCABA",
        tabBarStyle: {
          paddingTop: Platform.select({
            ios: 20,
            android: 7,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "",
          headerTransparent: true,
          title: "",
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
          popToTopOnBlur: true
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <Dumbbell size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <ChartColumn size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
