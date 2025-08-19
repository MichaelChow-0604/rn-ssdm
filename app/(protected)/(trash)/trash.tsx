import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import TrashListTable from "~/components/trash/trash-list-table";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Trash() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row gap-2 items-center my-8 px-4">
        <BackButton />
        <Text className="text-2xl font-semibold">Trash</Text>
      </View>

      {/* Scrollable session */}
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1"
      >
        <TrashListTable />
      </ScrollView>

      {/* Warning */}
      <View className="flex-row items-center justify-center py-2">
        <View className="w-[15%] flex items-center justify-center">
          <AntDesign name="exclamationcircleo" size={24} color="#E42D2D" />
        </View>
        <Text className="text-sm text-redtext w-[80%]">
          After a period of 30 days, the system automatically and permanently
          delete files from the trash.
        </Text>
      </View>
    </SafeAreaView>
  );
}
