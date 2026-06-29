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
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSession } from "../../../../context/SessionContext";
import { supabase } from "../../../../lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppCustomButton } from "../../../../components/shared/AppCustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { Trash2, ChevronDown, Check, Plus } from "lucide-react-native";
import {
  WorkoutIcon,
  DEFAULT_WORKOUT_ICON,
  iconMap,
} from "../workout/createWorkoutTemplate";

type ExerciseField = {
  // id is null for exercises added during this edit session that don't
  // exist in the DB yet. Existing exercises carry their real id so we
  // can diff against the original list on save.
  id: string | null;
  name: string;
  target: string;
};

const editWorkoutTemplate = () => {
  const { session } = useSession();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();

  const [isFetching, setIsFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  const [templateName, setTemplateName] = useState<string>("");
  const [templateIcon, setTemplateIcon] =
    useState<string>(DEFAULT_WORKOUT_ICON);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [exercise, setExercise] = useState<ExerciseField[]>([]);

  // Snapshot of exercises as they were loaded from the DB, used to diff
  // against the current `exercise` state on save so we know what to
  // update / insert / delete.
  const [originalExerciseIds, setOriginalExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    if (!templateId) {
      Alert.alert("Missing template", "No template was selected to edit.");
      router.back();
      return;
    }

    const fetchTemplate = async () => {
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
        .eq("id", templateId)
        .single();

      if (error || !data) {
        Alert.alert("Error", "Could not load this template. Please try again.");
        console.log("Error", error?.message);
        router.back();
        return;
      }

      setTemplateName(data.workout_template_name);
      setTemplateIcon(data.workout_template_icon ?? DEFAULT_WORKOUT_ICON);

      const sortedExercises = (data.exercise_template ?? [])
        .slice()
        .sort(
          (a, b) =>
            a.exercise_template_order_idx - b.exercise_template_order_idx,
        );

      const loadedExercises: ExerciseField[] = sortedExercises.map((ex) => ({
        id: ex.id,
        name: ex.exercise_template_name,
        target: ex.target_scheme ?? "",
      }));

      setExercise(
        loadedExercises.length > 0
          ? loadedExercises
          : [{ id: null, name: "", target: "" }],
      );
      setOriginalExerciseIds(sortedExercises.map((ex) => ex.id));
      setIsFetching(false);
    };

    fetchTemplate();
  }, [templateId]);

  const addExerciseField = () => {
    setExercise((prev) => [...prev, { id: null, name: "", target: "" }]);
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

    if (templateName.trim() === "") {
      Alert.alert("Template name is required");
      return;
    }

    const trimmedNonEmptyExercises = exercise.filter(
      (ex) => ex.name.trim() !== "",
    );

    if (trimmedNonEmptyExercises.length === 0) {
      Alert.alert("Add at least one exercise");
      return;
    }

    setSaving(true);

    // 1. Update the template row itself.
    const { error: templateError } = await supabase
      .from("workout_template")
      .update({
        workout_template_name: templateName,
        workout_template_icon: templateIcon,
      })
      .eq("id", templateId)
      .eq("profile_id", session.user.id);

    if (templateError) {
      Alert.alert(
        "Save Failed",
        "There was a problem saving your workout. Please try again",
      );
      console.log(templateError.message);
      setSaving(false);
      return;
    }

    // 2. Diff exercises against the original snapshot:
    //    - existing id, still present  -> update in place (preserves
    //      exercise_log links to this exercise)
    //    - no id (added this session)  -> insert as new
    //    - original id no longer present in current list -> delete.
    //      exercise_log.exercise_template_id is ON DELETE SET NULL, so
    //      old logged sets survive, just losing the live link.
    const currentIds = trimmedNonEmptyExercises
      .map((ex) => ex.id)
      .filter((id): id is string => id !== null);

    const idsToDelete = originalExerciseIds.filter(
      (id) => !currentIds.includes(id),
    );

    const toUpdate = trimmedNonEmptyExercises.filter((ex) => ex.id !== null);
    const toInsert = trimmedNonEmptyExercises.filter((ex) => ex.id === null);

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("exercise_template")
        .delete()
        .in("id", idsToDelete);

      if (deleteError) {
        Alert.alert(
          "Save Failed",
          "There was a problem removing some exercises. Please try again",
        );
        console.log(deleteError.message);
        setSaving(false);
        return;
      }
    }

    // Updates run individually since each row has different content;
    // Supabase doesn't support multi-row update-with-different-values
    // in a single call.
    for (let i = 0; i < toUpdate.length; i++) {
      const ex = toUpdate[i];
      const orderIdx = trimmedNonEmptyExercises.indexOf(ex) + 1;

      const { error: updateError } = await supabase
        .from("exercise_template")
        .update({
          exercise_template_name: ex.name,
          target_scheme: ex.target,
          exercise_template_order_idx: orderIdx,
        })
        .eq("id", ex.id);

      if (updateError) {
        Alert.alert(
          "Save Failed",
          "There was a problem updating an exercise. Please try again",
        );
        console.log(updateError.message);
        setSaving(false);
        return;
      }
    }

    if (toInsert.length > 0) {
      const formattedNewExercises = toInsert.map((ex) => ({
        workout_template_id: templateId,
        exercise_template_name: ex.name,
        target_scheme: ex.target,
        exercise_template_order_idx: trimmedNonEmptyExercises.indexOf(ex) + 1,
      }));

      const { error: insertError } = await supabase
        .from("exercise_template")
        .insert(formattedNewExercises);

      if (insertError) {
        Alert.alert(
          "Save Failed",
          "There was a problem adding new exercises. Please try again",
        );
        console.log(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);

    Alert.alert("Template updated", undefined, [
      {
        text: "OK",
        onPress: () => {
          router.dismissAll();
          router.replace("private/(tabs)/home");
        },
      },
    ]);
  };

  const SelectedIcon = iconMap[templateIcon] ?? iconMap[DEFAULT_WORKOUT_ICON];

  if (isFetching) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2AD4B2" />
        </View>
      </SafeAreaView>
    );
  }

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
                  Edit <Text style={{ color: "#2AD4B2" }}>Template</Text>
                </Text>
              </View>
              <View>
                <Text style={styles.headerDescriptionText}>
                  Update the name, icon or exercises in this template
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
                  <View style={styles.iconPreviewCircle}>
                    <SelectedIcon size={28} color="black" />
                  </View>

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
                <Text style={styles.stepTitle}>Edit your exercises</Text>
                <Text style={styles.stepDescription}>
                  Update existing exercises, remove ones you don't need, or add
                  new ones
                </Text>
                <View>
                  {exercise.map((item, index) => (
                    <View
                      key={item.id ?? `new-${index}`}
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
                          <TextInput
                            value={item.name}
                            onChangeText={(text) =>
                              handleExerciseNameChange(text, index)
                            }
                            placeholder={"Exercise Name"}
                            style={styles.textInputBarStyle}
                          />

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
            title="Save changes"
            disabled={saving}
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

export default editWorkoutTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 14,
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

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 0,

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
