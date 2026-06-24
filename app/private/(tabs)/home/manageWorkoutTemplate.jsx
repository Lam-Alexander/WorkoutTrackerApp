import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  import React, { useCallback, useState } from "react";
  import SelectableBox from "../../../../components/shared/SelectableBox";
  import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
  import { useRouter } from "expo-router";
  import { supabase } from "../../../../lib/supabase";
  import { useSession } from "../../../../context/SessionContext";
  import { useFocusEffect } from "expo-router";
  import { SquarePen, Trash2, Info } from "lucide-react-native";
  import { iconMap, DEFAULT_WORKOUT_ICON } from "../workout/createWorkoutTemplate";
  
  const manageWorkoutTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [workoutTemplate, setWorkoutTemplate] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const router = useRouter();
    const session = useSession();
  
    useFocusEffect(
      useCallback(() => {
        const userId = session.session?.user?.id;
        if (!userId) return;
  
        // Clear selection whenever the page regains focus (e.g. after
        // deleting/editing) so stale selections don't linger.
        setSelectedTemplate(null);
  
        const fetchTemplateData = async () => {
          setIsFetching(true);
  
          const { data, error } = await supabase
            .from("workout_template")
            .select(
              `id,
              workout_template_name,
              workout_template_icon,
              exercise_template ( 
                id,
                exercise_template_name,
                exercise_template_order_idx,
                target_scheme
              )`,
            )
            .eq("profile_id", session.session?.user.id);
  
          if (error) {
            console.log("Error", error.message);
            setIsFetching(false);
            return;
          }
  
          const formattedTemplateData = data.map((template) => ({
            templateId: template.id,
            templateName: template.workout_template_name,
            templateIcon:
              iconMap[template.workout_template_icon] ??
              iconMap[DEFAULT_WORKOUT_ICON],
            templateIconName:
              template.workout_template_icon ?? DEFAULT_WORKOUT_ICON,
  
            exercises: template.exercise_template
              .slice()
              .sort(
                (a, b) =>
                  a.exercise_template_order_idx - b.exercise_template_order_idx,
              )
              .map((exercise) => ({
                exerciseId: exercise.id,
                exerciseName: exercise.exercise_template_name,
                exerciseIdx: exercise.exercise_template_order_idx,
                exerciseTarget: exercise.target_scheme,
              })),
          }));
  
          setWorkoutTemplate(formattedTemplateData);
          setIsFetching(false);
        };
  
        fetchTemplateData();
      }, [session.session?.user.id]),
    );
  
    const editTemplate = () => {
      if (!selectedTemplate) {
        Alert.alert("Please select a template");
        return;
      }
  
      router.push({
        pathname: "private/(tabs)/home/editWorkoutTemplate",
        params: {
          templateId: selectedTemplate.templateId,
        },
      });
    };
  
    const deleteTemplate = async () => {
      if (!selectedTemplate) {
        Alert.alert("Please select a template");
        return;
      }
  
      Alert.alert(
        "Delete template?",
        `"${selectedTemplate.templateName}" will be removed. Your past workout history using this template will be kept.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setLoading(true);
  
              // Only the template row is removed here. exercise_template
              // rows are intentionally left in place (no cascade) so that
              // exercise_log / workout_log history referencing them stays
              // intact. They only get removed if the workout history itself
              // is deleted elsewhere.
              const { error } = await supabase
                .from("workout_template")
                .delete()
                .eq("id", selectedTemplate.templateId)
                .eq("profile_id", session.session?.user.id);
  
              if (error) {
                Alert.alert(
                  "Error",
                  "There was an issue deleting the template. Please try again",
                );
                console.log(error.message);
                setLoading(false);
                return;
              }
  
              setWorkoutTemplate((prev) =>
                prev.filter(
                  (t) => t.templateId !== selectedTemplate.templateId,
                ),
              );
              setSelectedTemplate(null);
              setLoading(false);
            },
          },
        ],
      );
    };
  
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 25 }}
        >
          <View style={styles.margin}>
            <View>
              <Text style={styles.dateContainer}>{today}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.title}>Manage <Text style={{color: "#2AD4B2"}}>Templates</Text></Text>
              {/* <View style={styles.dayPlanContainer}>
                <Text style={styles.dayPlanText}>Day plan</Text>
              </View> */}
            </View>
            <View>
              <Text style={styles.headerDescriptionText}>
                Select a template to edit its exercises or delete it
                completely
              </Text>
            </View>
          </View>
  
          {isFetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2AD4B2" />
            </View>
          ) : workoutTemplate.length === 0 ? (
            <View style={styles.cards}>
              <Info size={25} color="#2AD4B2" />
  
              <Text style={{ fontWeight: 500 }}>
                You don’t have any workout templates yet. Create one to get
                started.
              </Text>
            </View>
          ) : (
            workoutTemplate.map((item, index) => (
              <SelectableBox
                key={item.templateId}
                icon={item.templateIcon}
                label={item.templateName}
                title={item.templateName}
                description={item.exercises
                  .slice(0, 3)
                  .map((exercise) => exercise.exerciseName)
                  .join(", ")}
                selected={selectedTemplate?.templateId === item.templateId}
                onPress={() =>
                  setSelectedTemplate(
                    selectedTemplate?.templateId === item.templateId
                      ? null
                      : item,
                  )
                }
              />
            ))
          )}
  
          <View style={{ marginTop: 25 }}>
            <AppCustomButton
              title="Edit template"
              disabled={!selectedTemplate || loading}
              onPress={editTemplate}
              icon={SquarePen}
              colour={"default"}
             
            />
          </View>
  
          {selectedTemplate && (
            <View style={{ marginTop: 12, marginBottom: 25 }}>
              <AppCustomButton
                title="Delete template"
                disabled={loading}
                onPress={deleteTemplate}
                icon={Trash2}
                // colour={"default"}
                // buttonStyle={{backgroundColor: "#FA8072"}}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default manageWorkoutTemplate;
  
  const styles = StyleSheet.create({
    margin: {
      margin: 25,
      marginTop: 25,
    },
  
    cards: {
      backgroundColor: "#EAFBF7",
      marginHorizontal: 25,
      marginBottom: 12,
      padding: 16,
      borderRadius: 16,
      paddingRight: 50,
      flexDirection: "row",
      gap: 10,
    },
  
    loadingContainer: {
      paddingVertical: 60,
      alignItems: "center",
      justifyContent: "center",
    },
  
    headerDescriptionText: {
      fontSize: 14,
      color: "#94A3B8",
      fontWeight: "500",
      flexWrap: "wrap",
      marginTop: 15,
    },
  
    container: {
      flex: 1,
      backgroundColor: "#FCFCFC",
    },
  
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
  
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
  
    dateContainer: {
      marginBottom: 15,
      backgroundColor: "#F1F5F9",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      color: "#6B7280",
      fontSize: 12,
      fontWeight: 500,
    },
  
    dayPlanContainer: {
      backgroundColor: "#E6FFFA",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
  
    dayPlanText: {
      color: "#065F46",
      fontWeight: "600",
      fontSize: 12,
    },
  });
  