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
      <Stack.Screen name="(contact)/create-contact" />
      <Stack.Screen name="(contact)/[id]" />
      <Stack.Screen name="(document)/upload-document" />
      <Stack.Screen name="(document)/preview-document" />
      <Stack.Screen name="(document)/return-message" />
      <Stack.Screen name="(document)/edit-document" />
      <Stack.Screen
        name="(profile)/change-password"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/return-message-reset"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/privacy"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/language"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/terms-disclaimer"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/help-support"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/delete-account"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="(profile)/delete-confirm"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="notification-rule"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
