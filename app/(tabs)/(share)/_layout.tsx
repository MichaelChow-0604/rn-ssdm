import { Stack } from "expo-router";

export default function ShareLayout() {
  return (
    <Stack initialRouteName="share" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="share" />
    </Stack>
  );
}
