import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

export default function ForgetPasswordLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="otp-verification-forget" />
        <Stack.Screen name="new-password" />
        <Stack.Screen name="return-message-forget" />
      </Stack>
      <PortalHost />
    </>
  );
}
