// import {
//   FlatList,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Alert,
// } from "react-native";
// import React from "react";
// import { useRouter } from "expo-router";
// import { useSession } from "../../../../context/SessionContext";
// import { StatusBar } from "expo-status-bar";
// import { useColorScheme } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   Trophy,
//   CalendarCheck,
//   Sparkles,
//   Info,
//   Plus,
//   SquarePen,
//   CalendarRange,
//   History,
//   Activity,
//   Bell,
// } from "lucide-react-native";

// const home = () => {
//   const router = useRouter();
//   const { session } = useSession();

//   const templates = [
//     {
//       name: "New Template",
//       isCreated: true,
//     },
//     {
//       name: "Pull",

//     },
//     {
//       name: "Push",

//     },
//     {
//       name: "Leg",

//     },
//   ];

//   const handleComingSoon = () =>
//     Alert.alert("Coming Soon", "This feature is on its way!");

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 25 }}
//       >
//         <View style={{ paddingHorizontal: 25, paddingTop: 25 }}>
//           <View>
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <Text style={styles.headerName}>
//                 Hi,{" "}
//                 <Text style={{ color: "#2AD4B2" }}>
//                   {session?.user.user_metadata.display_name ?? "Guest"}
//                 </Text>
//               </Text>
//               <View
//                 style={{
//                   width: 40,
//                   height: 40,
//                   backgroundColor: "#F1F5F7",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: 20,
//                 }}
//               >
//                 <Bell />
//               </View>
//             </View>
//             <Text style={styles.headerDescriptionText}>
//               Welcome Back! Progress is built one workout at a time.
//             </Text>
//           </View>

//           <View style={styles.weeklyOverviewContainer}>
//             <View>
//               <Text style={styles.weeklyOverview}>Weekly Overview</Text>
//             </View>
//             <View>
//               <Text style={styles.weeklyOverviewHeaderText}>
//                 You're building {`\n`}momentum
//               </Text>
//               <Text style={styles.weeklyOverviewDescriptionText}>
//                 Your routine is taking shape. keep adding workout and template
//                 to make this week easier to follow
//               </Text>
//             </View>
//             <View style={styles.weeklyOverviewDualBoxContainer}>
//               <View style={styles.weeklyOverViewDualBox}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text style={{ fontSize: 12, color: "#94A3B8" }}>
//                     This Week
//                   </Text>
//                   <CalendarCheck size={16} color={"#94A3B8"} />
//                 </View>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "bold",
//                     marginVertical: 4,
//                   }}
//                 >
//                   3 days
//                 </Text>
//                 <Text
//                   style={{ fontSize: 14, color: "#2AD4B2", fontWeight: 500 }}
//                 >
//                   +1 from last week
//                 </Text>
//               </View>
//               <View style={styles.weeklyOverViewDualBox}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text style={{ fontSize: 12, color: "#94A3B8" }}>New PR</Text>
//                   <Trophy size={16} color={"#94A3B8"} />
//                 </View>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "bold",
//                     marginVertical: 4,
//                   }}
//                 >
//                   235 lbs
//                 </Text>
//                 <Text
//                   style={{ fontSize: 14, color: "#2AD4B2", fontWeight: 500 }}
//                 >
//                   Best Squat
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 backgroundColor: "white",
//                 marginTop: 20,
//                 padding: 20,
//                 paddingRight: 70,
//                 borderRadius: 20,
//                 flexDirection: "row",
//                 gap: 10,
//               }}
//             >
//               <Sparkles color={"#2AD4B2"} size={18} />
//               <Text style={{ fontWeight: 400 }}>
//                 <Text
//                   style={{ color: "#2AD4B2", fontWeight: "bold", fontSize: 16 }}
//                 >
//                   Tip:{" "}
//                 </Text>
//                 Save a full Push, Pull, Legs split so logging each session takes
//                 less time.
//               </Text>
//             </View>
//           </View>

//           <View>
//             <View
//               style={{
//                 marginTop: 40,
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text
//                 style={{ fontSize: 18, fontWeight: "bold", fontFamily: "" }}
//               >
//                 Split Templates
//               </Text>
//               <Text
//                 style={{ fontSize: 16, fontWeight: "600", color: "#2AD4B2" }}
//               >
//                 Edit
//               </Text>
//             </View>
//             <View
//               style={{
//                 backgroundColor: "#EAFBF7",
//                 marginTop: 20,
//                 padding: 20,
//                 paddingRight: 70,
//                 borderRadius: 20,
//                 flexDirection: "row",
//                 gap: 10,
//               }}
//             >
//               <Info color={"#2AD4B2"} size={22} />
//               <Text style={{ fontWeight: 500 }}>
//                 Create a routine like Push, Pull, Legs so your week is easier to
//                 plan and repeat.
//               </Text>
//             </View>
//             <View>
//               <FlatList
//                 horizontal
//                 data={templates}
//                 keyExtractor={(item) => item.name}
//                 ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
//                 renderItem={({ item }) =>
//                   item.isCreated ? (
//                     <Pressable
//                       onPress={() => router.push("/templates/create")}
//                       style={{
//                         width: 144,
//                         height: 144,
//                         borderRadius: 24,
//                         borderWidth: 2,
//                         borderStyle: "dashed",
//                         borderColor: "#EBEBEB",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         marginTop: 25,
//                         gap: 25,
//                       }}
//                     >
//                       <Plus color={"#94A3B8"} />
//                       <Text style={{ fontSize: 15, fontWeight: "600" }}>{item.name}</Text>
//                     </Pressable>
//                   ) : <Pressable
//                   onPress={() => router.push("/templates/create")}
//                   style={{
//                     width: 144,
//                     height: 144,
//                     borderRadius: 24,
//                     borderWidth: 2,
//                     borderColor: "#EBEBEB",
//                     backgroundColor: "white",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginTop: 25,
//                     gap: 25,
//                   }}
//                 >
//                   <Text style={{ fontSize: 15, fontWeight: "600" }}>{item.name}</Text>
//                 </Pressable>
//                 }
//               />
//             </View>
//           </View>

//           <View style={{ marginTop: 40 }}>
//             <View>
//               <Text
//                 style={{ fontSize: 18, fontWeight: "bold", fontFamily: "" }}
//               >
//                 Manage
//               </Text>
//             </View>

//             <View style={styles.manageOutsideBoxContainer}>
//               <Pressable style={{flex: 1}} onPress={() => router.push("/private/(tabs)/home/manageWorkoutTemplate")}>
//                 <View style={styles.manageInsideBoxContainer}>
//                   <View style={styles.mangeInsideBoxIcon}>
//                     <SquarePen />
//                   </View>
//                   <Text style={styles.mangeInsideBoxHeader}>Edit workout</Text>
//                   <Text style={styles.mangeInsideBoxDescription}>
//                     Update Exercise
//                   </Text>
//                 </View>
//               </Pressable>

//               <Pressable style={{flex: 1}} onPress={handleComingSoon}>
//                 <View style={styles.manageInsideBoxContainer}>
//                   <View style={styles.mangeInsideBoxIcon}>
//                     <CalendarRange />
//                   </View>
//                   <Text style={styles.mangeInsideBoxHeader}>
//                     Plan this week
//                   </Text>
//                   <Text style={styles.mangeInsideBoxDescription}>
//                     Next training days
//                   </Text>
//                 </View>
//               </Pressable>
//             </View>

//             <View style={styles.manageOutsideBoxContainer}>
//               <Pressable style={{flex: 1}} onPress={handleComingSoon}>
//                 <View style={styles.manageInsideBoxContainer}>
//                   <View style={styles.mangeInsideBoxIcon}>
//                     <History />
//                   </View>
//                   <Text style={styles.mangeInsideBoxHeader}>
//                     Recent workouts
//                   </Text>
//                   <Text style={styles.mangeInsideBoxDescription}>
//                     See latest session
//                   </Text>
//                 </View>
//               </Pressable>

//               <Pressable style={{flex: 1}} onPress={handleComingSoon}>
//                 <View style={styles.manageInsideBoxContainer}>
//                   <View style={styles.mangeInsideBoxIcon}>
//                     <Activity />
//                   </View>
//                   <Text style={styles.mangeInsideBoxHeader}>Activity Log</Text>
//                   <Text style={styles.mangeInsideBoxDescription}>
//                     2 workouts logged
//                   </Text>
//                 </View>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default home;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FCFCFC",
//   },

//   headerName: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },

//   headerDescriptionText: {
//     color: "#94A3B8",
//     fontSize: 16,
//     fontWeight: 500,
//     width: "70%",
//   },

//   weeklyOverviewContainer: {
//     backgroundColor: "#f2f5f7",
//     padding: 20,
//     borderRadius: 24,
//     marginTop: 25,
//   },

//   weeklyOverview: {
//     backgroundColor: "white",
//     alignSelf: "flex-start",
//     padding: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     color: "#2AD4B2",
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   weeklyOverviewHeaderText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginTop: 20,
//   },

//   weeklyOverviewDescriptionText: {
//     marginTop: 10,
//     color: "#94A3B8",
//     fontSize: 16,
//     fontWeight: "500",
//   },

//   weeklyOverviewDualBoxContainer: {
//     flexDirection: "row",
//     gap: 10,
//     justifyContent: "space-between",
//     marginTop: 20,
//   },

//   weeklyOverViewDualBox: {
//     backgroundColor: "white",
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     borderRadius: 16,
//     flex: 1,
//   },

//   // manageInsideBoxContainer: {
//   //   flex: 1,
//   //   height: 128,
//   //   width: 159,
//   //   borderColor: "#EBEBEB",
//   //   borderWidth: 2,
//   //   backgroundColor: "white",
//   //   borderRadius: 16,
//   //   padding: 15,
//   //   justifyContent: "space-evenly",
//   // },

//   manageInsideBoxContainer: {
//     flex: 1,
//     height: 128,
//     borderColor: "#EBEBEB",
//     borderWidth: 2,
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 15,
//     justifyContent: "space-evenly",
//   },

//   manageOutsideBoxContainer: {
//     flexDirection: "row",
//     marginVertical: 12,
//     gap: 12,
//   },

//   mangeInsideBoxIcon: {
//     width: 40,
//     height: 40,
//     backgroundColor: "#F1F5F7",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//   },

//   mangeInsideBoxHeader: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   mangeInsideBoxDescription: {
//     color: "#94A3B8",
//   },
// });

import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useSession } from "../../../../context/SessionContext";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Trophy,
  CalendarCheck,
  Sparkles,
  Info,
  Plus,
  SquarePen,
  CalendarRange,
  History,
  Activity,
  Bell,
  Dumbbell,
} from "lucide-react-native";
import { supabase } from "../../../../lib/supabase";
import { iconMap } from "../workout/createWorkoutTemplate";

const home = () => {
  const router = useRouter();
  const { session } = useSession();
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("workout_template")
        .select(
          `
          id,
          workout_template_name,
          workout_template_icon,
          exercise_template (
            exercise_template_name,
            exercise_template_order_idx
          )
        `,
        )
        .eq("profile_id", session.user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTemplates(data);
      }
    };

    fetchTemplates();
  }, [session]);

  const handleComingSoon = () =>
    Alert.alert("Coming Soon", "This feature is on its way!");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 25 }}
      >
        {/* ── header ── */}
        <View style={{ paddingHorizontal: 25, paddingTop: 25 }}>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.headerName}>
                Hi,{" "}
                <Text style={{ color: "#2AD4B2" }}>
                  {session?.user.user_metadata.display_name ?? "Guest"}
                </Text>
              </Text>
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#F1F5F7",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20,
                }}
              >
                <Bell />
              </View>
            </View>
            <Text style={styles.headerDescriptionText}>
              Welcome Back! Progress is built one workout at a time.
            </Text>
          </View>

          {/* ── Weekly Overview ── */}
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
                  <Text style={{ fontSize: 12, color: "#94A3B8" }}>
                    This Week
                  </Text>
                  <CalendarCheck size={16} color={"#94A3B8"} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginVertical: 4,
                  }}
                >
                  3 days
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#2AD4B2", fontWeight: 500 }}
                >
                  +1 from last week
                </Text>
              </View>
              <View style={styles.weeklyOverViewDualBox}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 12, color: "#94A3B8" }}>New PR</Text>
                  <Trophy size={16} color={"#94A3B8"} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginVertical: 4,
                  }}
                >
                  235 lbs
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#2AD4B2", fontWeight: 500 }}
                >
                  Best Squat
                </Text>
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
              <Sparkles color={"#2AD4B2"} size={18} />
              <Text style={{ fontWeight: 400 }}>
                <Text
                  style={{ color: "#2AD4B2", fontWeight: "bold", fontSize: 16 }}
                >
                  Tip:{" "}
                </Text>
                Save a full Push, Pull, Legs split so logging each session takes
                less time.
              </Text>
            </View>
          </View>

          {/* ── Split Template ── */}
          <View>
            <View
              style={{
                marginTop: 40,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", fontFamily: "" }}
              >
                Split Templates
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "600", color: "#2AD4B2" }}
              >
                Edit
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#EAFBF7",
                marginTop: 20,
                padding: 20,
                paddingRight: 70,
                borderRadius: 20,
                flexDirection: "row",
                gap: 10,
              }}
            >
              <Info color={"#2AD4B2"} size={22} />
              <Text style={{ fontWeight: 500 }}>
                Create a routine like Push, Pull, Legs so your week is easier to
                plan and repeat.
              </Text>
            </View>
            <View>
              <FlatList
                horizontal
                data={[{ isCreate: true }, ...templates]}
                keyExtractor={(item) => (item.isCreate ? "create" : item.id)}
                ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  if (item.isCreate) {
                    return (
                      <Pressable
                        onPress={() =>
                          router.push(
                            "private/(tabs)/workout/createWorkoutTemplate",
                          )
                        }
                        style={{
                          width: 144,
                          height: 144,
                          borderRadius: 24,
                          borderWidth: 2,
                          borderStyle: "dashed",
                          borderColor: "#EBEBEB",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 25,
                          gap: 25,
                        }}
                      >
                        <Plus color={"#94A3B8"} />
                        <Text style={{ fontSize: 15, fontWeight: "600" }}>
                          New Template
                        </Text>
                      </Pressable>
                    );
                  }

                  const sortedExercises = [...(item.exercise_template ?? [])]
                    .sort(
                      (a, b) =>
                        a.exercise_template_order_idx -
                        b.exercise_template_order_idx,
                    )
                    .slice(0, 2);

                  const exercisePreview =
                    sortedExercises.length > 0
                      ? sortedExercises
                          .map((e) => e.exercise_template_name)
                          .join(", ")
                      : "No exercises yet";

                  return (
                    <Pressable
                      onPress={() =>
                        router.push({
                          pathname: "private/(tabs)/workout",
                          params: { templateId: item.id },
                        })
                      }
                      style={{
                        width: 144,
                        height: 144,
                        borderRadius: 24,
                        borderWidth: 2,
                        borderColor: "#EBEBEB",
                        backgroundColor: "white",
                        padding: 15,
                        marginTop: 25,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#F1F5F7",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 12,
                        }}
                      >
                        {(() => {
                          const IconComponent =
                            iconMap[item.workout_template_icon] ?? Dumbbell;
                          return <IconComponent size={18} />;
                        })()}
                      </View>
                      <Text
                        style={{ fontSize: 14, fontWeight: "bold" }}
                        numberOfLines={1}
                      >
                        {item.workout_template_name}
                      </Text>
                      <Text
                        style={{ color: "#94A3B8", fontSize: 11 }}
                        numberOfLines={2}
                      >
                        {exercisePreview}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>

          {/* ── Manage ── */}
          <View style={{ marginTop: 40 }}>
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", fontFamily: "" }}
              >
                Manage
              </Text>
            </View>

            <View style={styles.manageOutsideBoxContainer}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() =>
                  router.push("/private/(tabs)/home/manageWorkoutTemplate")
                }
              >
                <View style={styles.manageInsideBoxContainer}>
                  <View style={styles.mangeInsideBoxIcon}>
                    <SquarePen />
                  </View>
                  <Text style={styles.mangeInsideBoxHeader}>Edit workout</Text>
                  <Text style={styles.mangeInsideBoxDescription}>
                    Update Exercise
                  </Text>
                </View>
              </Pressable>

              <Pressable style={{ flex: 1 }} onPress={handleComingSoon}>
                <View style={styles.manageInsideBoxContainer}>
                  <View style={styles.mangeInsideBoxIcon}>
                    <CalendarRange />
                  </View>
                  <Text style={styles.mangeInsideBoxHeader}>
                    Plan this week
                  </Text>
                  <Text style={styles.mangeInsideBoxDescription}>
                    Next training days
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.manageOutsideBoxContainer}>
              <Pressable style={{ flex: 1 }} onPress={handleComingSoon}>
                <View style={styles.manageInsideBoxContainer}>
                  <View style={styles.mangeInsideBoxIcon}>
                    <History />
                  </View>
                  <Text style={styles.mangeInsideBoxHeader}>
                    Recent workouts
                  </Text>
                  <Text style={styles.mangeInsideBoxDescription}>
                    See latest session
                  </Text>
                </View>
              </Pressable>

              <Pressable style={{ flex: 1 }} onPress={handleComingSoon}>
                <View style={styles.manageInsideBoxContainer}>
                  <View style={styles.mangeInsideBoxIcon}>
                    <Activity />
                  </View>
                  <Text style={styles.mangeInsideBoxHeader}>Activity Log</Text>
                  <Text style={styles.mangeInsideBoxDescription}>
                    2 workouts logged
                  </Text>
                </View>
              </Pressable>
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
    backgroundColor: "#FCFCFC",
  },

  headerName: {
    fontSize: 24,
    fontWeight: "bold",
  },

  headerDescriptionText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: 500,
    width: "70%",
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

  manageInsideBoxContainer: {
    flex: 1,
    height: 128,
    borderColor: "#EBEBEB",
    borderWidth: 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    justifyContent: "space-evenly",
  },

  manageOutsideBoxContainer: {
    flexDirection: "row",
    marginVertical: 12,
    gap: 12,
  },

  mangeInsideBoxIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F1F5F7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  mangeInsideBoxHeader: {
    fontSize: 14,
    fontWeight: "bold",
  },

  mangeInsideBoxDescription: {
    color: "#94A3B8",
  },
});
