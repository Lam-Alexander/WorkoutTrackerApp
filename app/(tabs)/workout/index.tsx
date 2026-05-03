import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import SelectableBox from "../../../components/shared/SelectableBox";
import { PersonStanding, Shield, MoveDiagonal2, SlidersHorizontal, ArrowRight } from "lucide-react-native";
import { AppCustomButton } from "../../../components/shared/AppCustomButton";

const Data = [
  {
    title: "Push",
    description: "Squats, Romanian deadlifts, leg press, lunges",
    icon: PersonStanding,
    label: "person-standing",
  },

  {
    title: "Pull",
    description: "Rows, pull-ups, pulldowns, rear delts, biceps",
    icon: Shield,
    label: "shield",
  },
  {
    title: "Legs",
    description: "Bench, shoulder press, incline work, triceps",
    icon: MoveDiagonal2,
    label: "move-diagonal-l2",
  },
];

const workout = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const handleSubmit = () => {};

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
      <View style={styles.workoutSplitContainer}>
        <Text style={styles.workoutSplitTitle}>Workout Split</Text>
        <Text style={styles.workoutSplitDescription}>
          Start with a common split or choose a combined day when you want more
          variety.
        </Text>
        {Data.map((item, index) => (
          <SelectableBox
            key={item.title}
            icon={item.icon}
            label={item.label}
            title={item.title}
            description={item.description}
            selected={selected === index}
            onPress={() => setSelected(selected === index ? null : index)}
          />
        ))}
      </View>
      <View style={{marginTop: 50}}>
      <AppCustomButton
      title="Continue to Exercise"
      onPress={()=> handleSubmit()}
      icon={ArrowRight}
      colour={"default"}
      
      /> 
      </View>

      <View style={{marginTop: 25}}>
      <AppCustomButton
      title="Continue to Exercise"
      onPress={()=> handleSubmit()}
      icon={SlidersHorizontal}
      /> 
      </View>

      
    </ScrollView>
  );
};

export default workout;

const styles = StyleSheet.create({
  margin: {
    margin: 25,
    marginTop: 50
  },

  defaultText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
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

  workoutSplitContainer: {
    backgroundColor: "white",
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 12,
    paddingTop: 15,
    paddingBottom: 15,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,

    // Android shadow
    elevation: 3,
  },

  workoutSplitTitle: {
    marginLeft: 25,
    fontSize: 20,
    fontWeight: "bold",
  },

  workoutSplitDescription: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
    flexWrap: "wrap",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 15,
  },
});
