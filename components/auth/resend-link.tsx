import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

export interface ResendLinkProps {
  label: string;
  cooldownSeconds: number;
  onPress: () => void;
  className?: string;
  isLoading?: boolean;
}

export function ResendLink({
  label,
  cooldownSeconds,
  onPress,
  className = "",
  isLoading = false,
}: ResendLinkProps) {
  const disabled = isLoading || cooldownSeconds > 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={className}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#438BF7" />
      ) : (
        <Text
          className={`text-button text-center text-lg font-bold ${
            disabled ? "opacity-50" : ""
          }`}
        >
          {disabled ? `${label} in ${cooldownSeconds}s` : label}
        </Text>
      )}
    </Pressable>
  );
}
