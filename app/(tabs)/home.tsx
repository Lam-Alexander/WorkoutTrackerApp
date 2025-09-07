import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

const home = () => {
  const router = useRouter();

  // const signOut = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) {
  //     console.log("Error Signing Out", error);
  //   }
  //   router.replace("/");
  // };

  return (
    <View style={styles.container}>
      <Text>home</Text>
      {/* <Button title="Sign Out" onPress={signOut} /> */}
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
