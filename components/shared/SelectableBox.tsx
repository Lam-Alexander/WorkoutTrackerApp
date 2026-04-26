import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

interface SelectableBoxProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

const SelectableBox = ({
  title,
  description,
  selected,
  onPress,
}: SelectableBoxProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.cards}>
        <View>
          <Text>{title}</Text>
          <Text>{description}</Text>
        </View>

        <View
          style={[styles.checkCircle, selected && styles.checkCircleSelected]}
        ></View>
      </Pressable>
    </View>
  );
};

export default SelectableBox;

const styles = StyleSheet.create({

    container: {
        // backgroundColor: "white",
        // marginTop: 15
    },

  cards: {
    backgroundColor: "#F1F5F7",
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
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
});
