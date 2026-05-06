import { Tabs } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Platform } from "react-native";
import { House, Dumbbell, ChartColumn, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6FCABA",
        tabBarStyle: {
          paddingTop: Platform.select({
            ios: 10,
            android: 5,
            default: 10,
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
          title: "Home",
          tabBarIcon: ({ color }) => <House size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: "workout",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <Dumbbell size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <ChartColumn size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "",
          headerTransparent: true,
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
