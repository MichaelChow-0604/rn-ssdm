import { Redirect, Stack } from "expo-router";
import { useAuth } from "~/lib/auth-context";

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/auth" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(contact)/contact" />
      <Stack.Screen name="(contact)/[id]" />
      <Stack.Screen name="notification-rule" />
    </Stack>
  );
}
