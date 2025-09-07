import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { Router, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";


const settings = () => {
  const router = useRouter();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Supabase error signing out:", error.message);
    }

    // This will logout a device that has an missing Auth Session due to multi device login
    await (supabase.auth as any)._removeSession();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("Session after signout:", session);

    console.log("Signed out Successfully");
    router.push("/");
  };

  return (
    <View style={styles.center}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default settings;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
