import React from "react";
import { Button, ButtonProps } from "@rneui/themed";

interface CustomButtonProps extends ButtonProps {
  title: string;
  loading?: boolean;
  onPress: () => void;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading,
  onPress,
  buttonStyle,
  type,
  ...props
}) => {
  return (
    <Button
      title={title}
      loading={loading}
      onPress={onPress}
      type={type}
      buttonStyle={{
        borderRadius: 5,
        backgroundColor:
          type === "solid" ? "#6fcaba" : undefined,
      }}
      {...props}
    />
  );
};


 