import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

export default function AuthLayout() {
  return (
    <>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(forget-password)"
          options={{ headerShown: false }}
        />
      </Stack>
      <PortalHost />
    </>
  );
}
