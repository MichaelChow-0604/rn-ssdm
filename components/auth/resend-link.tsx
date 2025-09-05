import React from "react";
import { Pressable, Text } from "react-native";

export interface ResendLinkProps {
  label: string;
  cooldownSeconds: number;
  onPress: () => void;
  className?: string;
}

export function ResendLink({
  label,
  cooldownSeconds,
  onPress,
  className = "",
}: ResendLinkProps) {
  const disabled = cooldownSeconds > 0;

  return (
    <Pressable onPress={onPress} disabled={disabled} className={className}>
      <Text
        className={`text-button text-center text-lg font-bold ${
          disabled ? "opacity-50" : ""
        }`}
      >
        {disabled ? `${label} in ${cooldownSeconds}s` : label}
      </Text>
    </Pressable>
  );
}
