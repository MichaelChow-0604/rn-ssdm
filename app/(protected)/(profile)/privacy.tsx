import { Text, SafeAreaView, View, ScrollView } from "react-native";
import { BackButton } from "~/components/back-button";
import { Separator } from "~/components/ui/separator";
import {
  COLLECT_INFO_1,
  COLLECT_INFO_2,
  COLLECT_INFO_TITLE,
  CONTACT_US,
  CONTACT_US_TITLE,
  PRIVACY_POLICY,
  PRIVACY_POLICY_OF_SSDM,
  PRIVACY_POLICY_OF_SSDM_TITLE,
} from "~/constants/privacy-policy";
import {} from "~/constants/terms-and-disclaimer";

export default function Privacy() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 py-4">
        <BackButton />
        <Text className="text-2xl font-bold">{PRIVACY_POLICY}</Text>
      </View>

      <Separator className="mt-6" />

      {/* Content */}
      <ScrollView className="flex-1 px-6">
        <View className="flex-col gap-4 my-6">
          {/* Privacy policy of SSDM */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">
              {PRIVACY_POLICY_OF_SSDM_TITLE}
            </Text>
            <Text>{PRIVACY_POLICY_OF_SSDM}</Text>
          </View>

          {/* How we collect information about you 1 */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">{COLLECT_INFO_TITLE}</Text>
            <Text>{COLLECT_INFO_1}</Text>
          </View>

          {/* How we collect information about you 2 */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">{COLLECT_INFO_TITLE}</Text>
            <Text>{COLLECT_INFO_2}</Text>
          </View>

          {/* How you can contact us about privacy questions */}
          <View className="flex-col gap-1">
            <Text className="text font-bold">{CONTACT_US_TITLE}</Text>
            <Text>{CONTACT_US}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
