import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useSession } from "../../../../context/SessionContext";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trophy, CalendarCheck, Sparkles } from "lucide-react-native";

const home = () => {
  const router = useRouter();
  const { session } = useSession();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ margin: 25 }}>
        <View>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.headerName}>
                Hi,{" "}
                <Text style={{ color: "#2AD4B2" }}>
                  {session?.user.user_metadata.display_name ?? "Guest"}
                </Text>
              </Text>
            </View>
            <Text style={styles.headerDescriptionText}>
              Welcome Back! Progress is built one workout at a time. Let’s stay
              disciplined and keep progressing.
            </Text>
          </View>
          <View style={styles.weeklyOverviewContainer}>
            <View>
              <Text style={styles.weeklyOverview}>Weekly Overview</Text>
            </View>
            <View>
              <Text style={styles.weeklyOverviewHeaderText}>
                You're building {`\n`}momentum
              </Text>
              <Text style={styles.weeklyOverviewDescriptionText}>
                Your routine is taking shape. keep adding workout and template
                to make this week easier to follow
              </Text>
            </View>
            <View style={styles.weeklyOverviewDualBoxContainer}>
              <View style={styles.weeklyOverViewDualBox}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>This Week</Text>
                  <CalendarCheck />
                </View>
                <Text>3 days</Text>
                <Text>+1 from last week</Text>
              </View>
              <View style={styles.weeklyOverViewDualBox}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>New PR</Text>
                  <Trophy />
                </View>
                <Text>235 lbs</Text>
                <Text>Best Squat</Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: "white",
                marginTop: 20,
                padding: 20,
                paddingRight: 70,
                borderRadius: 20,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Sparkles color={"#2AD4B2"} />
              <Text>
                <Text style={{ color: "#2AD4B2", fontWeight: "bold" }}>
                  Tips:{" "}
                </Text>
                Save a full Push, Pull, Legs split so logging each session takes
                less time.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  headerName: {
    fontSize: 24,
    fontWeight: "bold",
  },

  headerDescriptionText: {
    color: "#94A3B8",
    marginTop: 10,
    fontSize: 16,
    fontWeight: 500,
  },

  weeklyOverviewContainer: {
    backgroundColor: "#f2f5f7",
    padding: 20,
    borderRadius: 24,
    marginTop: 25,
  },

  weeklyOverview: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    padding: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    color: "#2AD4B2",
    fontSize: 14,
    fontWeight: "500",
  },

  weeklyOverviewHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  weeklyOverviewDescriptionText: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },

  weeklyOverviewDualBoxContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginTop: 20,
  },

  weeklyOverViewDualBox: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 16,
    flex: 1,
  },
});
