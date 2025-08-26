import { router, useLocalSearchParams } from "expo-router";
import { Text, SafeAreaView, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";

export default function ReturnMessage() {
  const { mode, transactionId, uploadDate, uploadTime } = useLocalSearchParams<{
    mode: "success" | "error";
    transactionId?: string;
    uploadDate?: string;
    uploadTime?: string;
  }>();
  const isSuccess = mode === "success";

  const iconOuterColor = isSuccess ? "bg-blue-200" : "bg-red-200";
  const iconInnerColor = isSuccess ? "bg-blue-500" : "bg-red-400";

  const title = isSuccess ? "Upload Successful!" : "Oops!";
  const buttonText = isSuccess
    ? "BACK TO HOME"
    : "BACK TO DOCUMENT DETAIL FORM";

  const SuccessDescription = () => {
    return (
      <View className="flex-col gap-4 w-full items-center">
        <View className="flex-col gap-1 items-center w-[80%]">
          <View className="flex-row gap-1 items-center">
            <AntDesign name="file1" size={16} color="#6b7280" />
            <Text className="text text-gray-500">Document Transaction ID:</Text>
          </View>

          <Text className="text text-gray-500 text-center">
            {transactionId ?? "-"}
          </Text>
        </View>

        <View className="flex-row gap-1 items-center">
          <Feather name="calendar" size={16} color="#6b7280" />
          <Text className="text text-gray-500">
            Upload date: {uploadDate ?? "-"}
          </Text>
        </View>

        <View className="flex-row gap-1 items-center">
          <AntDesign name="clockcircleo" size={16} color="#6b7280" />
          <Text className="text text-gray-500">
            Upload time: {uploadTime ?? "-"}
          </Text>
        </View>
      </View>
    );
  };

  const ErrorDescription = () => {
    return (
      <Text className="text text-gray-500 text-center w-2/3">
        Something went wrong! Please check your information and try again.
      </Text>
    );
  };

  const handleButtonPress = () => {
    if (isSuccess) {
      router.replace("/documents");
    } else {
      router.replace("../");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center gap-4">
      {/* Icon */}
      <View
        className={`w-32 h-32 rounded-full ${iconOuterColor} items-center justify-center`}
      >
        <View
          className={`w-24 h-24 rounded-full ${iconInnerColor} items-center justify-center`}
        >
          {isSuccess ? (
            <Feather name="check" size={32} color="white" />
          ) : (
            <Feather name="x" size={32} color="white" />
          )}
        </View>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold">{title}</Text>

      {/* Description */}
      {isSuccess ? <SuccessDescription /> : <ErrorDescription />}

      {/* Button */}
      <Button
        className="rounded-full bg-button mt-8"
        onPress={handleButtonPress}
      >
        <Text className="text-white font-bold text-center">{buttonText}</Text>
      </Button>
    </SafeAreaView>
  );
}
