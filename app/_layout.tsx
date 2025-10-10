import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import "~/global.css";
import { AuthProvider } from "~/context/auth-context";
import { ProfileProvider } from "~/context/profile-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner-native";
import { SettingsProvider } from "~/context/setting-context";
import { BuoyDebugger } from "~/lib/buoy-debugger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min: typical app-wide baseline
      gcTime: 30 * 60_000, // 30 min: keeps data around for quick back/forward
      refetchOnWindowFocus: true, // On RN, refetch on app foreground
      refetchOnReconnect: true,
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <AuthProvider>
            <ProfileProvider>
              <SettingsProvider>
                {/* <BuoyDebugger /> */}

                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" />
                  <Stack.Screen name="(protected)" />
                  <Stack.Screen name="terms-and-conditions" />
                </Stack>

                <PortalHost />
              </SettingsProvider>
            </ProfileProvider>
          </AuthProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>

      <Toaster theme="dark" />
    </GestureHandlerRootView>
  );
}
