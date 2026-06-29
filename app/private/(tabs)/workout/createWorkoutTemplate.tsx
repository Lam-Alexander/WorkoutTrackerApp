import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Modal,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useSession } from "../../../../context/SessionContext";
import { supabase } from "../../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { router } from "expo-router";
import {
  Trash2,
  ChevronDown,
  Check,
  Shield,
  PersonStanding,
  MoveDiagonal2,
  BicepsFlexed,
  Dumbbell,
  Heart,
  Flame,
  Zap,
  Footprints,
  Activity,
  LucideIcon,
  Plus,
  Star,
} from "lucide-react-native";

// Curated list of icon names. These must match real lucide-react-native
// export names exactly since they're used directly as keys into iconMap
// and stored as-is in supabase (workout_template_icon).
export const WorkoutIcon = [
  "BicepsFlexed",
  "Dumbbell",
  "Shield",
  "PersonStanding",
  "MoveDiagonal2",
  "Heart",
  "Flame",
  "Zap",
  "Footprints",
  "Activity",
  "Star",
];

export const DEFAULT_WORKOUT_ICON = "BicepsFlexed";

export const iconMap: Record<string, LucideIcon> = {
  BicepsFlexed,
  Dumbbell,
  Shield,
  PersonStanding,
  MoveDiagonal2,
  Heart,
  Flame,
  Zap,
  Footprints,
  Activity,
  Star,
};

const createWorkoutTemplate = () => {
  const { session } = useSession();
  const [templateName, setTemplateName] = useState<string>("");
  const [templateIcon, setTemplateIcon] =
    useState<string>(DEFAULT_WORKOUT_ICON);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [exercise, setExercise] = useState([{ name: "", target: "" }]);

  const addExerciseField = () => {
    setExercise((prev) => [...prev, { name: "", target: "" }]);
  };

  const handleExerciseNameChange = (text: string, index: number) => {
    const updatedExercise = [...exercise];
    updatedExercise[index].name = text;
    setExercise(updatedExercise);
  };

  const handleExerciseTargetChange = (text: string, index: number) => {
    const updatedExercise = [...exercise];
    updatedExercise[index].target = text;
    setExercise(updatedExercise);
  };

  const handleRemoveExercise = (index: number) => {
    const newArr = exercise.filter((_, i) => i !== index);
    setExercise(newArr);
  };

  const handleSaveTemplate = async () => {
    if (!session) {
      Alert.alert("No session found");
      return;
    }

    const trimmedNonEmptyExercises = exercise
      .map((exercise) => exercise.name.trim())
      .filter((exercise) => exercise !== "");

    if (templateName.trim() === "") {
      Alert.alert("Template name is required");
      return;
    }

    if (trimmedNonEmptyExercises.length === 0) {
      Alert.alert("Add at least one exercise");
      return;
    }

    const { error, data, status } = await supabase
      .from("workout_template")
      .insert([
        {
          profile_id: session.user.id,
          workout_template_name: templateName,
          workout_template_icon: templateIcon,
        },
      ])
      .select()
      .single();

    if (error) {
      Alert.alert(
        "Saved Failed",
        "There was a problem saving your workout. Please try again",
      );
    }

    if (status === 201) {
      console.log(data);
      setTemplateName("");
      setTemplateIcon(DEFAULT_WORKOUT_ICON);

      const formattedExerciseTemplateData = exercise.map(
        (exercises, index) => ({
          workout_template_id: data.id,
          exercise_template_name: exercises.name,
          target_scheme: exercises.target,
          exercise_template_order_idx: index + 1,
        }),
      );

      const { error: exerciseError } = await supabase
        .from("exercise_template")
        .insert(formattedExerciseTemplateData);

      if (exerciseError) {
        console.log("Error", exerciseError.message);
        return;
      }

      setExercise([{ name: "", target: "" }]);

      Alert.alert("Successfully Added", undefined, [
        {
          text: "OK",
          onPress: () => {
            router.dismissAll();
            router.replace("private/(tabs)/workout");
          },
        },
      ]);
    }
  };

  const SelectedIcon = iconMap[templateIcon] ?? iconMap[DEFAULT_WORKOUT_ICON];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 25 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.margin}>
            <View>
              <View style={styles.templateSetupContainer}>
                <Text style={styles.templateSetupText}>Template Setup</Text>
              </View>
              <View>
                <Text style={styles.headerTitleText}>
                  Create your <Text style={{color: "#2AD4B2"}}>Template</Text>
                </Text>
              </View>
              <View>
                <Text style={styles.headerDescriptionText}>
                  Pick the focus for today before adding your exercise and
                  tracking reps
                </Text>
              </View>
            </View>
            <View>
              <View style={styles.workoutSplitContainer}>
                <View style={styles.stepPill}>
                  <Text style={styles.stepPillText}>Step 1</Text>
                </View>
                <Text style={styles.stepTitle}>Pick the workout day</Text>
                <Text style={styles.stepDescription}>
                  Choose a preset like push, pull, legs or add your own custom
                  name
                </Text>
                <View>
                  <TextInput
                    style={styles.textInputBarStyle}
                    placeholder="Template Name"
                    value={templateName}
                    onChangeText={(text) => setTemplateName(text)}
                  />
                </View>
              </View>
            </View>

            <View>
              <View style={styles.workoutSplitContainer}>
                <View style={styles.stepPill}>
                  <Text style={styles.stepPillText}>Step 2</Text>
                </View>
                <Text style={styles.stepTitle}>Select your icon</Text>
                <Text style={styles.stepDescription}>
                  Pick an icon to help you recognize this template at a glance
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                  }}
                >
                  {/* Preview on the left */}
                  <View style={styles.iconPreviewCircle}>
                    <SelectedIcon size={28} color="black" />
                  </View>

                  {/* Dropdown trigger */}
                  <Pressable
                    style={styles.dropdownTrigger}
                    onPress={() => setIconPickerOpen(true)}
                  >
                    <Text style={styles.dropdownText}>{templateIcon}</Text>
                    <ChevronDown size={20} color="#6B7280" />
                  </Pressable>
                </View>

                <Modal
                  visible={iconPickerOpen}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setIconPickerOpen(false)}
                >
                  <Pressable
                    style={styles.overlay}
                    onPress={() => setIconPickerOpen(false)}
                  >
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                      <Text style={styles.modalTitle}>Choose an icon</Text>
                      <FlatList
                        data={WorkoutIcon}
                        keyExtractor={(item) => item}
                        style={{ maxHeight: 350 }}
                        renderItem={({ item }) => {
                          const ItemIcon = iconMap[item];
                          const isSelected = item === templateIcon;
                          return (
                            <Pressable
                              style={[
                                styles.optionRow,
                                isSelected && styles.optionRowSelected,
                              ]}
                              onPress={() => {
                                setTemplateIcon(item);
                                setIconPickerOpen(false);
                              }}
                            >
                              <View style={styles.optionIconCircle}>
                                <ItemIcon size={22} color="black" />
                              </View>
                              <Text style={styles.optionLabel}>{item}</Text>
                              {isSelected && (
                                <Check
                                  size={18}
                                  color="#2AD4B2"
                                  style={{ marginLeft: "auto" }}
                                />
                              )}
                            </Pressable>
                          );
                        }}
                      />
                    </Pressable>
                  </Pressable>
                </Modal>
              </View>
            </View>

            <View>
              <View style={styles.workoutSplitContainer}>
                <View style={styles.stepPill}>
                  <Text style={styles.stepPillText}>Step 3</Text>
                </View>
                <Text style={styles.stepTitle}>Add your exercise</Text>
                <Text style={styles.stepDescription}>
                  Choose a preset like push, pull, legs or add your own custom
                  name
                </Text>
                <View>
                  {exercise.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        borderBottomColor: "#A9A9A9",
                        borderBottomWidth: 1,
                        paddingTop: 10,
                        paddingBottom: 25,
                        paddingHorizontal: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 25,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "500" }}>
                          Exercise {index + 1}
                        </Text>

                        <Trash2
                          onPress={() => handleRemoveExercise(index)}
                          color={"#6B7280"}
                        />
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={{ width: "100%", gap: 20 }}>
                          {/* EXERCISE INPUT */}
                          <TextInput
                            value={item.name}
                            onChangeText={(text) =>
                              handleExerciseNameChange(text, index)
                            }
                            placeholder={"Exercise Name"}
                            style={styles.textInputBarStyle}
                          />

                          {/* TARGET INPUT */}
                          <TextInput
                            value={item.target}
                            onChangeText={(text) =>
                              handleExerciseTargetChange(text, index)
                            }
                            placeholder={"3 sets of 8-12 | 1 set of 5+ AMRAP"}
                            style={styles.textInputBarStyle}
                          />
                        </View>
                      </View>
                    </View>
                  ))}
                  <View></View>
                </View>
              </View>
            </View>
          </View>
          <AppCustomButton
            title="Add Exercise"
            onPress={addExerciseField}
            icon={Plus}
            style={{ marginTop: 25 }}
          />
          <AppCustomButton
            title="Save workout template"
            onPress={handleSaveTemplate}
            icon={Check}
            colour={"default"}
            style={{ marginTop: 25, width: "100%" }}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default createWorkoutTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

  margin: {
    margin: 25,
    marginTop: 25,
  },

  headerTitleText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  headerDescriptionText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginTop: 15,
  },

  templateSetupContainer: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  templateSetupText: {
    fontSize: 12,
    color: "#065F46",
    fontWeight: "600",
  },

  workoutSplitContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,

    // Android shadow
    elevation: 0.2,
  },

  iconPreviewCircle: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdownTrigger: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  textInputBarStyle: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 15,
  },

  dropdownText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 12,
  },

  optionRowSelected: {
    backgroundColor: "#F0FDF9",
  },

  optionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  optionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  stepPill: {
    backgroundColor: "#E6FFFA",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  stepPillText: {
    color: "#065F46",
    fontWeight: "500",
    fontSize: 11,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  stepDescription: {
    color: "#486895",
    marginBottom: 15,
    fontSize: 12,
  },
});
