import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="(share)" />
      <Tabs.Screen name="(contact)" />
      <Tabs.Screen name="(profile)" />
    </Tabs>
  );
}
