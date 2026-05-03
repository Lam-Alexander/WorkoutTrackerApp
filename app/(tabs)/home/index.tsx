import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useSession } from "../../../context/SessionContext";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

const home = () => {
  const router = useRouter();
  const { session } = useSession();
  const colorScheme = useColorScheme(); // detects dark/light mode

  return (
    <View style={styles.container}>
      <Text>
        Welcome back {session?.user.user_metadata.display_name ?? "Guest"}
      </Text>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
});
