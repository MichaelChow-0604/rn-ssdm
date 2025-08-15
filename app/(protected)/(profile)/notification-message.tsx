import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { BackButton } from "~/components/back-button";
import { Textarea } from "~/components/ui/textarea";
import {
  EMAIL_NOTIFICATION_MESSAGE,
  SMS_NOTIFICATION_MESSAGE,
  WHATSAPP_NOTIFICATION_MESSAGE,
} from "~/constants/notification-message";

export default function NotificationMessage() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pt-4">
        <BackButton />
        <Text className="text-2xl font-bold">Notification Message</Text>
      </View>

      <ScrollView
        className="flex-1 flex-col w-[85%] mx-auto"
        contentContainerClassName="items-center justify-start gap-8 pt-4 pb-8"
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <View className="flex-col gap-2 w-full">
          <Text className="text-2xl font-bold text-center text-button">
            Email
          </Text>
          <Textarea
            editable={false}
            autoExpand={true}
            value={EMAIL_NOTIFICATION_MESSAGE}
            className="native:opacity-100 text-gray-700 bg-gray-100 native:text-sm"
          />
        </View>

        <View className="flex-col gap-2 w-full">
          <Text className="text-2xl font-bold text-center text-button">
            WhatsApp
          </Text>
          <Textarea
            editable={false}
            autoExpand={true}
            value={WHATSAPP_NOTIFICATION_MESSAGE}
            className="native:opacity-100 text-gray-700 bg-gray-100 native:text-sm"
          />
        </View>

        <View className="flex-col gap-2 w-full">
          <Text className="text-2xl font-bold text-center text-button">
            SMS
          </Text>
          <Textarea
            editable={false}
            autoExpand={true}
            value={SMS_NOTIFICATION_MESSAGE}
            className="native:opacity-100 text-gray-700 bg-gray-100 native:text-sm"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
