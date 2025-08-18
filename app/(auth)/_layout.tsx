import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="return-message" />
      <Stack.Screen name="account-deleted" />
      <Stack.Screen name="(forget-password)" />
    </Stack>
  );
}
