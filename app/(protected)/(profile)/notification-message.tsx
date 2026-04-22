import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Textarea } from "~/components/ui/textarea";
import {
  EMAIL_NOTIFICATION_MESSAGE,
  SMS_NOTIFICATION_MESSAGE,
  WHATSAPP_NOTIFICATION_MESSAGE,
} from "~/constants/notification-message";

const SECTIONS = [
  { title: "Email", value: EMAIL_NOTIFICATION_MESSAGE },
  { title: "WhatsApp", value: WHATSAPP_NOTIFICATION_MESSAGE },
  { title: "SMS", value: SMS_NOTIFICATION_MESSAGE },
] as const;

function MessageSection({ title, value }: { title: string; value: string }) {
  return (
    <View className="flex-col gap-2 w-full">
      <Text className="text-2xl font-bold text-center text-button">
        {title}
      </Text>
      <Textarea
        editable={false}
        autoExpand={true}
        value={value}
        className="native:opacity-100 text-gray-700 bg-gray-100 native:text-sm"
      />
    </View>
  );
}

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
        {SECTIONS.map((s) => (
          <MessageSection key={s.title} title={s.title} value={s.value} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
