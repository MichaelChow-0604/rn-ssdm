import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

export default function AuthLayout() {
  return (
    <>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="otp-verification" />
        <Stack.Screen name="return-message" />
        <Stack.Screen name="(forget-password)" />
      </Stack>
      <PortalHost />
    </>
  );
}
