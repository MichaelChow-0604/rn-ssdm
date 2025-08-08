import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Switch } from "~/components/ui/switch";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Input } from "~/components/ui/input";

export default function NotificationRule() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-start px-8">
        {/* Header */}
        <View className="flex-row gap-2 items-center my-8">
          <BackButton />
          <Text className="text-2xl font-semibold">Notification Rule</Text>
        </View>

        {/* Setting wrapper */}
        <View className="gap-6 w-full">
          {/* Notification Status */}
          <View className="flex-row justify-between items-center">
            {/* Title */}
            <View className="flex-row gap-2 items-center">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#374151"
              />
              <Text className="font-semibold text-lg text-gray-700">
                Notification Status
              </Text>
            </View>

            <Switch
              checked={notificationEnabled}
              onCheckedChange={setNotificationEnabled}
            />
          </View>

          {/* Notification Frequency */}
          <View className="flex-col w-full gap-2">
            {/* Title */}
            <View className="flex-row gap-2 items-center">
              <Feather name="calendar" size={24} color="#374151" />
              <Text className="font-semibold text-lg text-gray-700">
                Notification Frequency
              </Text>
            </View>

            <Input
              placeholder="Maximum of 4 notifications per month"
              className="w-full bg-gray-200 border border-gray-300 placeholder:text-gray-950 font-medium"
              editable={false}
            />

            <Text className="text-sm text-gray-500">
              Pre-selected default mode, non-editable. Scheduled every Monday.
            </Text>
          </View>

          {/* Notification Time Slot */}
          <View className="flex-col w-full gap-2">
            {/* Title */}
            <View className="flex-row gap-2 items-center">
              <Feather name="clock" size={24} color="#374151" />
              <Text className="font-semibold text-lg text-gray-700">
                Notification Time Slot
              </Text>
            </View>

            <Input
              placeholder="12:00 PM (noon) local time"
              className="w-full bg-gray-200 border border-gray-300 placeholder:text-gray-950 font-medium"
              editable={false}
            />

            <Text className="text-sm text-gray-500">
              Pre-set default time, non-editable.
            </Text>
          </View>
        </View>

        <View className="flex-row justify-start items-center w-full py-12 gap-1">
          <Feather name="info" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-500 italic font-medium">
            Up to 4 notifications monthly, typically on Mondays at 12:00 PM HKT
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
