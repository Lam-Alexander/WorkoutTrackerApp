import { Input, InputProps } from "@rneui/themed";
import React, { useState } from "react";

interface CustomInputProps extends InputProps {
  label?: string;
}

export const AuthCustomInput = ({
  label,
  onChangeText,
  value,
  placeholder,
  leftIcon,
  onFocus,
  onBlur,
  placeholderTextColor,
  ...props
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const primaryFocusColour = "#3DD8C3";
  const defaultColour = "#797979";
  const defaultPlaceholderColour = "#A0A0A0";

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleblurred = () => {
    setIsFocused(false);
  };

  return (
    <Input
      label={label}
      labelStyle={{ color: isFocused ? primaryFocusColour : defaultColour }}
      leftIcon={
        leftIcon && typeof leftIcon === "object"
          ? {
              ...leftIcon,
              color: isFocused ? primaryFocusColour : defaultColour,
            }
          : undefined
      }
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      onFocus={handleFocus}
      onBlur={handleblurred}
      placeholderTextColor={
        isFocused ? primaryFocusColour : defaultPlaceholderColour
      }
      inputContainerStyle={{
        borderBottomWidth: 1,
        borderBottomColor: isFocused ? primaryFocusColour : "#999",
      }}
      {...props}
    />
  );
};
