import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack initialRouteName="profile" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen
        name="edit-profile"
        options={{ animation: "slide_from_right" }}
      />
    </Stack>
  );
}
