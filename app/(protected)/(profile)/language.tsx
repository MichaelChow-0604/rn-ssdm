import { SafeAreaView, View, Text, Image } from "react-native";
import { BackButton } from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { useState } from "react";

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState<
    "en" | "zh-hk" | "zh-cn"
  >("en");

  const handleSelectLanguage = (language: "en" | "zh-hk" | "zh-cn") => {
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
          className={`w-[90%] border-2 flex-row items-center justify-center border-button gap-2 ${
            selectedLanguage === "en"
              ? "border-button bg-blue-100"
              : "border-gray-200 bg-white"
          }`}
          size="lg"
          onPress={() => handleSelectLanguage("en")}
        >
          <Text className="font-bold text-black">English</Text>
        </Button>

        <Button
          className={`w-[90%] border-2 flex-row items-center justify-center border-button gap-2 ${
            selectedLanguage === "zh-hk"
              ? "border-button bg-blue-100"
              : "border-gray-200 bg-white"
          }`}
          size="lg"
          onPress={() => handleSelectLanguage("zh-hk")}
          disabled={true}
        >
          <Text className="font-bold text-black">繁中</Text>
        </Button>

        <Button
          className={`w-[90%] border-2 flex-row items-center justify-center border-button gap-2 ${
            selectedLanguage === "zh-cn"
              ? "border-button bg-blue-100"
              : "border-gray-200 bg-white"
          }`}
          size="lg"
          onPress={() => handleSelectLanguage("zh-cn")}
          disabled={true}
        >
          <Text className="font-bold text-black">简中</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
