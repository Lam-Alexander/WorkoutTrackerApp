import { Text, View, Dimensions, PixelRatio } from "react-native";
import { Pressable, Image } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../context/SessionContext";
import React from "react";
import { CustomButton } from "../components/shared/CustomButton";

const App = () => {
  const router = useRouter();
  const { session } = useSession();

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const scale = SCREEN_WIDTH / 375;
  const normalize = (size: number) =>
    Math.round(PixelRatio.roundToNearestPixel(size * scale));

  if (session && session.user) {
    return <Redirect href="/workout" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          flex: 1,
          padding: 16,
          justifyContent: "space-evenly",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: normalize(28),
              fontWeight: "bold",
            }}
          >
            Fit<Text style={{ color: "#00dfc0" }}>Tracker.</Text>
          </Text>
          <Image
            style={{ width: 334, height: 334, marginTop: 25 }}
            source={require("../images/female-workout.png")}
          />
          <Text
            style={{
              fontSize: normalize(24),
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 15,
            }}
          >
            Built for Progress
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#6B7280",
              marginTop: 15,
              fontSize: normalize(15),
            }}
          >
            Track your workouts without the nonsense.{"\n"} No subcription. No
            distraction. {"\n"}Just results.
          </Text>
        </View>

        <View style={{alignItems:"center"}}>
          <CustomButton
            title="Get Started"
            type="solid"
            onPress={() => router.navigate("/auth/signup")}
            containerStyle={{width: "80%", marginBottom: 20, }}
          />

          <CustomButton
            title="Continue as guest"
            type="clear"
            onPress={() => router.push("/(tabs)/home")}
            containerStyle={{ width: "45%", marginBottom: 20 }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#6B7280", fontSize: normalize(15) }}>
              Already have an account?{" "}
            </Text>
            <Pressable>
              {({ pressed }) => (
                <Text
                  style={{
                    color: pressed ? "#00dfc0" : "#3DD8C3",
                    fontWeight: "bold",
                    fontSize: normalize(15),
                  }}
                  onPress={() => router.push("./auth/login")}
                >
                  Sign In
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
