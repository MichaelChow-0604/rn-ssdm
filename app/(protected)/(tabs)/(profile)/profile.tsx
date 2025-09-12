import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useProfile } from "~/context/profile-context";
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

export default function ProfileTab() {
  const { profile } = useProfile();
  const { setIsAuthenticated } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { clearTokens } = useTokenStore();

  const logoutMutation = useApiMutation<LogoutResponse, void>({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: () => {
      clearTokens();
      setIsAuthenticated(false);
    },
    onError: () => toast.error("Failed to logout. Please try again later."),
  });

  return (
    <SafeAreaView className="flex-1 bg-blue-100">
      {/* Curved blue topper */}
      <View className="h-[40%] bg-[#438BF7] rounded-b-[20px] absolute top-0 left-0 right-0" />

      <KeyboardAvoidingView
        className="flex-1 items-start px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          {/* Profile pic */}
          <View className="flex items-center justify-center w-full gap-1 flex-col pt-20 pb-10">
            {/* Profile pic box */}
            <View className="w-24 h-24 relative">
              <View className="rounded-full">
                <Image
                  source={
                    profile.profilePic
                      ? { uri: profile.profilePic }
                      : require("~/assets/images/default_icon.png")
                  }
                  className="w-24 h-24 rounded-full text-black"
                />
              </View>
            </View>

            <Text className="text-xl font-bold text-white">
              {profile.firstName} {profile.lastName}
            </Text>
          </View>

          {/* Form section */}
          <Card className="w-full bg-white p-4 rounded-xl gap-4 mb-16 border-gray-200">
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
      </KeyboardAvoidingView>

      <LogoutConfirm
        visible={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => logoutMutation.mutate()}
      />
    </SafeAreaView>
  );
}
