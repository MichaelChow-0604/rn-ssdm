import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useLocalStorage } from "../hooks/use-local-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  // AsyncStorage.clear();
  // See whether the user has accepted the terms and conditions
  const { value: accepted, isLoading } = useLocalStorage<boolean>("accepted");

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Redirect href={accepted ? "/(auth)/auth" : "/terms-and-conditions"} />
  );
}
