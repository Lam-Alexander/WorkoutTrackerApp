import { View, Text, StyleSheet } from "react-native";
import React from "react";

const copy = () => {
  return (
    <ScrollView>
      <View>
        {exercise.map((ex) => (
          <View key={ex.exerciseId} style={styles.exerciseContainer}>
            <Text style={styles.title}>{ex.exerciseName}</Text>
            <Text style={styles.subTitle}>Track lifted weight</Text>

            {/* HEADER */}
            <View style={styles.row}>
              <Text style={styles.col}>Set</Text>
              <Text style={styles.col}>Prev</Text>
              <Text style={styles.col}>Reps</Text>
              <Text style={styles.col}>Weight</Text>
            </View>

            {/* ROWS */}
            {ex.sets.map((set, idx) => (
              <View key={set.id} style={styles.row}>
                <Text style={styles.col}>{set.setNumber}</Text>

                <Text style={styles.col}>89</Text>

                <TextInput
                  value={set.reps}
                  placeholder="Reps"
                  style={styles.input}
                  onChangeText={(text) => {
                    const updated = [...exercise];
                    updated.find((e) => e.exerciseId === ex.exerciseId).sets[
                      idx
                    ].reps = text;
                    setExercise(updated);
                  }}
                />

                <TextInput
                  value={set.weight}
                  placeholder="Weight"
                  style={styles.input}
                  onChangeText={(text) => {
                    const updated = [...exercise];
                    updated.find((e) => e.exerciseId === ex.exerciseId).sets[
                      idx
                    ].weight = text;
                    setExercise(updated);
                  }}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default copy;

const styles = StyleSheet.create({
  exerciseContainer: {
    margin: 25,
    backgroundColor: "#FCFCFC",
    padding: 15,
    borderRadius: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  subTitle: {
    marginBottom: 10,
    color: "gray",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  // ✅ THIS is your shared column system
  col: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    textAlign: "center",
  },
});
