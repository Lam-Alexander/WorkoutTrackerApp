import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import SelectableBox from "../../components/shared/SelectableBox";

const Data = [
  {
    title: "Push",
    description: "Squats, Romanian deadlifts, leg press, lunges",
    image: ""
  },

  {
    title: "Pull",
    description: "Rows, pull-ups, pulldowns, rear delts, biceps",
    image:""
  },
  {
    title: "Legs",
    description: "Bench, shoulder press, incline work, triceps",
    image:""
  },
];

const workout = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.margin}>
        <View>
          <Text
            style={[styles.defaultText, { marginTop: 15, marginBottom: 15 }]}
          >
            {today}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Choose your {"\n"}workout</Text>
          <View style={styles.dayPlanContainer}>
            <Text style={styles.dayPlanText}>Day plan</Text>
          </View>
        </View>
        <View>
          <Text style={[styles.defaultText, { marginTop: 15 }]}>
            Pick the focus for today before adding your exercise and tracking
            reps
          </Text>
        </View>
      </View>
      <View style={styles.selectableBoxContainer}>
        <Text style={styles.workoutSplitTitle}>Workout Split</Text>
        <Text style={[styles.defaultText, { marginLeft: 25, marginRight: 25 }]}>
          Start with a common split or choose a combined day when you want more
          variety.
        </Text>
        {Data.map((item, index) => (
          <SelectableBox
            key={item.title}
            title={item.title}
            description={item.description}
            selected={selected === index}
            onPress={() => setSelected(selected === index ? null : index)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default workout;

const styles = StyleSheet.create({
  margin: {
    margin: 25,
  },

  defaultText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },

  container: {
    flex: 1,
    // backgroundColor: "#FCFCFC",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
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
  },

  selectableBoxContainer: {
    backgroundColor: "white",
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 12,
    paddingTop: 15,
    paddingBottom: 15,
  },

  workoutSplitTitle: {
    marginLeft: 25,
    fontSize: 20,
    fontWeight: "bold"
  },

  workoutSplitDescription: {},
});
