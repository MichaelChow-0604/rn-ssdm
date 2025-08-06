import { Stack } from "expo-router";

export default function ContactLayout() {
  return (
    <Stack initialRouteName="contact" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="contact" />
    </Stack>
  );
}
