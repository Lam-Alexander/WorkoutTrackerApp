import React from "react";
import { Button, ButtonProps } from "@rneui/themed";
import { LucideIcon } from "lucide-react-native";

interface CustomButtonProps extends Omit<ButtonProps, "icon"> {
  title: string;
  loading?: boolean;
  icon: LucideIcon;
  colour?: "default";
  onPress: () => void;
}

export const AppCustomButton = ({
  title,
  loading,
  onPress,
  icon: Icon,
  buttonStyle,
  colour,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      icon={<Icon size={20} color={colour === "default" ? "white" : "black"} />}
      buttonStyle={{
        borderRadius: 5,
        backgroundColor: colour === "default" ? "#3DD8C3" : "#F1F5F7",
        height: 56,
        marginHorizontal: 25,
        alignItems: "center"
        
      }}
      titleStyle={{
        color: colour === "default" ? "white" : "black",
        fontWeight: "500",
        padding: 10
      }}
      {...props}
    />
  );
};
