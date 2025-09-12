import { Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Separator } from "~/components/ui/separator";
import {
  ACCEPTANCE_OF_TERMS,
  ACCEPTANCE_OF_TERMS_TITLE,
  DISCLAIMER,
  DISCLAIMER_TITLE,
  TERMS_AND_DISCLAIMER,
} from "~/constants/terms-and-disclaimer";

export default function TermsDisclaimer() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 py-4">
        <BackButton />
        <Text className="text-2xl font-bold">{TERMS_AND_DISCLAIMER}</Text>
      </View>

      <Separator className="mt-6 bg-gray-300" />

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <View className="flex-col gap-4 my-6">
          {/* Acceptance of Terms */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">{ACCEPTANCE_OF_TERMS_TITLE}</Text>
            <Text>{ACCEPTANCE_OF_TERMS}</Text>
          </View>

          {/* Disclaimer */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">{DISCLAIMER_TITLE}</Text>
            <Text>{DISCLAIMER}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
