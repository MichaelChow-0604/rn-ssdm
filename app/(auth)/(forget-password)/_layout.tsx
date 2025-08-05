import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

export default function ForgetPasswordLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="otp-verification"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="new-password" options={{ headerShown: false }} />
        <Stack.Screen name="return-message" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </>
  );
}
