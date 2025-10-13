import { Redirect } from "expo-router";
import { View, ActivityIndicator, Platform } from "react-native";
import { useLocalStorage } from "../hooks/use-local-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { usePushNotification } from "~/hooks/use-push-notification";

export default function Index() {
  // AsyncStorage.clear();
  // See whether the user has accepted the terms and conditions
  const { value: accepted, isLoading } = useLocalStorage<boolean>("accepted");

  // Set up the push notification
  usePushNotification();

  useEffect(() => {
    if (Platform.OS === "android") {
      // Set the navigation bar style
      NavigationBar.setStyle("light");
      NavigationBar.setBackgroundColorAsync("#ffffff");
    }
  }, []);

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
