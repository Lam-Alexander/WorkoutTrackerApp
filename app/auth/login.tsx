import React, { useState } from "react";
import { Text, View, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderLogo } from "../../components/shared/HeaderLogo";
import { CustomInput } from "../../components/shared/CustomInput";
import { CustomButton } from "../../components/shared/CustomButton";
import { Redirect, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../context/SessionContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { session } = useSession();

  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  };

  if (session && session.user) {
    return <Redirect href="home" />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-evenly",
      }}
    >
      <View>
        <HeaderLogo />
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#797979",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Welcome Back!
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 275, height: 267, marginTop: 5 }}
          source={require("../../images/women-barbel.png")}
        />
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          padding: 15,
          justifyContent: "space-evenly",
        }}
      >
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

        <CustomButton
          title="Login"
          onPress={() => signInWithEmail()}
          type="solid"
          containerStyle={{ width: "70%", marginTop: 0 }}
          loading={loading}
        />

        <CustomButton
          title="Forgot Password?"
          type="clear"
          onPress={() => router.push("./auth/forgot-password")}
          containerStyle={{ width: "45%" }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#6B7280", fontSize: 15 }}>
          Don't have an account?{" "}
        </Text>
        <Pressable>
          {({ pressed }) => (
            <Text
              style={{
                color: pressed ? "#00dfc0" : "#3DD8C3",
                fontWeight: "bold",
                fontSize: 15,
              }}
              onPress={() => router.push("./signup")}
            >
              Sign Up
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Login;
