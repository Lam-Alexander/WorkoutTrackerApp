import { Alert, StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { supabase } from "../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomInput } from "../../components/shared/CustomInput";
import { CustomButton } from "../../components/shared/CustomButton";
import { Redirect, useRouter } from "expo-router";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const signUpWithEmail = async () => {
    // reset previous error
    setErrorMessage("");

    // check empty field first
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Please fill in all fields");
      return;
    }

    // check password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: name,
          },
        },
      });
      // console.log(JSON.stringify(result, null, 2));

      if (error !== null) {
        Alert.alert(error.message);
        return;
      }

      if (data.session === null) {
        Alert.alert(
          "Check your inbox",
          "If you're new, you'll get a verification email. If not, try signing in.",
        );
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        router.push("./login");
        return;
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Unexcepted run time error, Check the console for more details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 28,
              fontWeight: "bold",
              marginTop: -25,
            }}
          >
            Fit<Text style={{ color: "#00dfc0" }}>Tracker.</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#797979",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Create your account
          </Text>
        </View>
        <View style={{ marginTop: 30, marginBottom: -30, padding: 15 }}>
          <CustomInput
            label="Name"
            leftIcon={{ type: "font-awesome", name: "user", size: 30 }}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder=" Name"
          />

          <CustomInput
            label="Email"
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
            }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder=" Email@address.com"
          />
          <CustomInput
            label="Password"
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              size: 35,
            }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder=" Password"
            secureTextEntry={true}
          />

          <CustomInput
            label="Confirm Password"
            leftIcon={{
              type: "font-awesome",
              name: "lock",
              size: 35,
            }}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            placeholder=" Confirm Password"
            secureTextEntry={true}
          />
        </View>

        {errorMessage !== "" && (
          <Text style={{ color: "red", textAlign: "center" }}>
            {errorMessage}
          </Text>
        )}

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <CustomButton
            title="Register"
            onPress={() => signUpWithEmail()}
            type="solid"
            containerStyle={{ width: "70%" }}
            loading={loading}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={{ color: "#6B7280", fontSize: 15 }}>
              Already have an account?{" "}
            </Text>
            <Pressable>
              {({ pressed }) => (
                <Text
                  style={{
                    color: pressed ? "#00dfc0" : "#3DD8C3",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                  onPress={() => router.push("./login")}
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

const styles = StyleSheet.create({});

export default Signup;
