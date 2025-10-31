import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "~/global.css";
import { AuthProvider } from "~/context/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { SettingsProvider } from "~/context/setting-context";
import { StatusBar } from "react-native";
import { queryClient } from "~/lib/react-query";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar translucent={false} />
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <SettingsProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(protected)" />
                <Stack.Screen name="terms-and-conditions" />
              </Stack>

              <PortalHost />
            </SettingsProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>

      <Toaster theme="dark" />
    </GestureHandlerRootView>
  );
}
