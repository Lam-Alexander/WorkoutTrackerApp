import React from "react";
import { Button, ButtonProps } from "@rneui/themed";

interface CustomButtonProps extends ButtonProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
}

export const CustomButton = ({
  title,
  loading,
  onPress,
  buttonStyle,
  type,
  ...props
}: CustomButtonProps) => {
  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      type={type}
      buttonStyle={{
        borderRadius: 5,
        backgroundColor:
          type === "solid" ? "#3DD8C3" : undefined,
      }}
      {...props}
    />
  );
};


 