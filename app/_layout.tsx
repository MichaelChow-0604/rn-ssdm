import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "~/global.css";
import { AuthProvider } from "~/context/auth-context";
import { ProfileProvider } from "~/context/profile-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthProvider>
          <ProfileProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(protected)" />
            </Stack>
          </ProfileProvider>
        </AuthProvider>
      </BottomSheetModalProvider>
      <PortalHost />
    </GestureHandlerRootView>
  );
}
