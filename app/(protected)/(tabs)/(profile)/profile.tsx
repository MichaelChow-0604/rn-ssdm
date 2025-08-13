import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Card } from "~/components/ui/card";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "~/components/ui/button";
import { router } from "expo-router";
import { useProfile } from "~/lib/profile-context";
import { useAuth } from "~/lib/auth-context";
import { useState } from "react";
import { LogoutConfirm } from "~/components/pop-up/logout-confirm";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  labelClassName?: string;
}

export function SettingRow({
  icon,
  label,
  onPress,
  right,
  labelClassName,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="flex items-center justify-center w-[20%]">{icon}</View>
      <Text
        className={`font-semibold text-gray-600 flex-1 ${labelClassName ?? ""}`}
      >
        {label}
      </Text>
      {right ?? <Entypo name="chevron-small-right" size={24} color="#4b5563" />}
    </TouchableOpacity>
  );
}

export default function Profile() {
  const { profile } = useProfile();
  const { setIsAuthenticated } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handleNotifications = () => {
    router.push("/notification-rule");
  };

  const handlePrivacy = () => {
    router.push("/privacy");
  };

  const handleHelpSupport = () => {
    router.push("/help-support");
  };

  const handleTermsDisclaimer = () => {
    router.push("/terms-disclaimer");
  };

  const handleLanguage = () => {
    router.push("/language");
  };

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
          <Card className="w-full bg-white p-4 rounded-xl gap-4 mb-16">
            {/* Account section */}
            <View className="flex-col gap-2">
              <Text className="text-lg font-bold">Account</Text>
              <View className="flex-col gap-3">
                {/* Edit profile */}
                <SettingRow
                  icon={<AntDesign name="user" size={24} color="#4b5563" />}
                  label="Profile"
                  onPress={handleEditProfile}
                />

                {/* Notifications */}
                <SettingRow
                  icon={
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="#4b5563"
                    />
                  }
                  label="Notifications"
                  onPress={handleNotifications}
                />

                {/* Change Password */}
                <SettingRow
                  icon={
                    <MaterialIcons name="password" size={24} color="#4b5563" />
                  }
                  label="Change Password"
                  onPress={handleChangePassword}
                />
              </View>
            </View>

            {/* Support & About section */}
            <View className="flex-col gap-2">
              <Text className="text-lg font-bold">Support & About</Text>
              <View className="flex-col gap-3">
                {/* Help & Support */}
                <SettingRow
                  icon={
                    <AntDesign
                      name="questioncircleo"
                      size={24}
                      color="#4b5563"
                    />
                  }
                  label="Help & Support"
                  onPress={handleHelpSupport}
                />

                {/* Terms and Policies */}
                <SettingRow
                  icon={
                    <AntDesign
                      name="exclamationcircleo"
                      size={24}
                      color="#4b5563"
                    />
                  }
                  label="Terms and Disclaimer"
                  onPress={handleTermsDisclaimer}
                />

                {/* Privacy */}
                <SettingRow
                  icon={<AntDesign name="lock" size={24} color="#4b5563" />}
                  label="Privacy Policy"
                  onPress={handlePrivacy}
                />
              </View>
            </View>

            {/* More */}
            <View className="flex-col gap-2">
              <Text className="text-lg font-bold">More</Text>
              <View className="flex-col gap-3">
                {/* Language */}
                <SettingRow
                  icon={<Feather name="globe" size={24} color="#4b5563" />}
                  label="Language"
                  onPress={handleLanguage}
                />

                {/* Delete Account */}
                <SettingRow
                  icon={
                    <AntDesign name="deleteuser" size={24} color="#E42D2D" />
                  }
                  label="Delete Account"
                  onPress={() => {}}
                  labelClassName="text-red-500"
                />
              </View>
            </View>

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
        onConfirm={() => setIsAuthenticated(false)}
      />
    </SafeAreaView>
  );
}
