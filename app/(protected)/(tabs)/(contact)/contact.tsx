import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "~/components/search-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Contact() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 gap-4">
        <SearchBar className="flex-1" placeholder="Search contacts" />

        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-full p-2"
          onPress={() => router.push("/create-contact")}
        >
          <Ionicons name="person-add" size={24} color="#438BF7" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
