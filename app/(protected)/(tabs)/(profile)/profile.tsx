import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/context/auth-context";
import { useState } from "react";
import { LogoutConfirm } from "~/components/pop-up/logout-confirm";
import { SettingsSection } from "~/components/profile/setting-section";
import {
  accountItems,
  moreItems,
  supportItems,
} from "~/constants/profile-navigation";
import { logout } from "~/lib/http/endpoints/auth";
import { toast } from "sonner-native";
import { useTokenStore } from "~/store/use-token-store";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { LogoutResponse } from "~/lib/http/response-type/auth";
import { useSettings } from "~/context/setting-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "~/lib/http/endpoints/profile";
import { ProfileAvatar } from "~/components/profile-avatar";

export default function ProfileTab() {
  const { setIsAuthenticated } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { clearTokens } = useTokenStore();
  const { setNotificationEnabled } = useSettings();

  const {
    data: profile,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: ["profile", "get"],
    queryFn: getProfile,
  });

  const logoutMutation = useApiMutation<LogoutResponse, void>({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      clearTokens();
      setIsAuthenticated(false);
      setNotificationEnabled(true);
    },
    onError: () => toast.error("Failed to logout. Please try again later."),
  });

  return (
    <SafeAreaView
      className="flex-1 bg-blue-100"
      edges={["top", "left", "right"]}
    >
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-b-[20px] absolute top-0 left-0 right-0" />

      <View className="flex-1 px-4">
        {isLoading || isRefetching ? (
          <View className="flex-1 w-full items-center justify-center mt-32">
            <ActivityIndicator size="small" color="gray" />
          </View>
        ) : (
          <ScrollView
            className="w-full"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Profile pic */}
            <View className="flex items-center justify-center w-full gap-1 flex-col pt-20 pb-10">
              {/* Profile pic box */}
              <ProfileAvatar
                source={
                  profile?.profilePictureUrl
                    ? {
                        uri: profile.profilePictureUrl,
                        name: "profilePicture",
                        mimeType: "image/jpeg",
                      }
                    : null
                }
                isEditable={false}
              />

              <Text className="text-xl font-bold text-white">
                {profile?.firstName} {profile?.lastName}
              </Text>
            </View>

            {/* Form section */}
            <Card className="w-full bg-white p-4 rounded-xl gap-4 border-gray-200">
              {/* Account section */}
              <SettingsSection title="Account" items={accountItems} />
              {/* Support & About section */}
              <SettingsSection title="Support & About" items={supportItems} />
              {/* More */}
              <SettingsSection title="More" items={moreItems} />
              {/* Logout */}
              <Button
                className="bg-button w-[40%] mx-auto mt-12 mb-4"
                onPress={() => setDialogOpen(true)}
              >
                <Text className="text-white font-bold">LOGOUT</Text>
              </Button>
            </Card>
          </ScrollView>
        )}
      </View>

      <LogoutConfirm
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
    </SafeAreaView>
  );
}
