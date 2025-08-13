import { SafeAreaView, View, Text, Image } from "react-native";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "zh">("en");

  const handleSelectLanguage = (language: "en" | "zh") => {
    setSelectedLanguage(language);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center gap-2 px-4 pt-4 pb-8">
        <BackButton />
        <Text className="text-2xl font-bold">Language</Text>
      </View>

      {/* Select language */}
      <View className="flex-col gap-4 items-center">
        <Button
          className={`w-[90%] border-2 flex-row items-center justify-start border-button gap-2 ${
            selectedLanguage === "en"
              ? "border-button bg-blue-100"
              : "border-gray-200 bg-white"
          }`}
          size="lg"
          onPress={() => handleSelectLanguage("en")}
        >
          <View className="h-8 w-8 rounded-full overflow-hidden">
            <Image
              source={require("~/assets/lang_icon/us.png")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text className="font-bold text-black">English</Text>
        </Button>

        <Button
          className={`w-[90%] border-2 flex-row items-center justify-start border-button gap-2 ${
            selectedLanguage === "zh"
              ? "border-button bg-blue-100"
              : "border-gray-200 bg-white"
          }`}
          size="lg"
          onPress={() => handleSelectLanguage("zh")}
          // TODO: Add functionality to select Chinese
          disabled={true}
        >
          <View className="h-8 w-8 rounded-full overflow-hidden">
            <Image
              source={require("~/assets/lang_icon/zh.png")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text className="font-bold text-black">中文</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
