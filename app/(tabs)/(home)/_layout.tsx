import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack initialRouteName="documents" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="documents" />
    </Stack>
  );
}
