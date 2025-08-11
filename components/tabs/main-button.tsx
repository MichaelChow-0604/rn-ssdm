import { TouchableOpacity, View, Platform } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";

export default function MainButton() {
  return (
    <TouchableOpacity
      className={`bg-icon absolute left-1/2 -translate-x-1/2 w-20 h-20 rounded-full items-center justify-center ${
        Platform.OS === "ios" ? "bottom-0.5" : "bottom-8"
      }`}
      activeOpacity={0.7}
      onPress={() => {
        router.push("/upload-document");
      }}
    >
      <View className="bg-button w-16 h-16 rounded-full items-center justify-center">
        <FontAwesome6 name="plus" size={32} color="white" />
      </View>
    </TouchableOpacity>
  );
}
