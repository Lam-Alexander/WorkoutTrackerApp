import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Check, LucideIcon } from "lucide-react-native";

interface SelectableBoxProps {
  title: string;
  description: string;
  selected: boolean;
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}

const SelectableBox = ({
  title,
  description,
  selected,
  onPress,
  icon: Icon,
  label,
}: SelectableBoxProps) => {
  return (
    <View>
      <Pressable
        onPress={onPress}
        style={[styles.cards, selected && styles.cardsSelected]}
      >
        <View
          accessibilityLabel={label}
          style={[styles.iconCircle, selected && styles.iconCircleSelected]}
        >
          <Icon size={28} color={selected ? "white" : "black"} />
        </View>
        <View style={styles.textContainer}>
          <Text>{title}</Text>
          <Text>{description}</Text>
        </View>

        <View
          style={[styles.checkCircle, selected && styles.checkCircleSelected]}
        >
          <Check size={18} color={selected ? "white" : "black"} />
        </View>
      </Pressable>
    </View>
  );
};

export default SelectableBox;

const styles = StyleSheet.create({
  cards: {
    backgroundColor: "#F1F5F7",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  cardsSelected: {
    backgroundColor: "#E6FFFA",
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  iconCircleSelected: {
    backgroundColor: "#2AD4B2",
  },

  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  checkCircleSelected: {
    backgroundColor: "#2AD4B2",
  },

  textContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
});
