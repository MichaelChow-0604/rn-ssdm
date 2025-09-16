import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { router, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useMemo, useEffect, useState, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import { addDocument } from "~/lib/storage/document";
import {
  useContactsOptions,
  usePrefetchContactDetails,
} from "~/lib/contacts/hooks";
import { LoadingOverlay } from "~/components/loading-overlay";

export default function PreviewDocument() {
  const {
    title,
    description,
    category,
    type,
    fileName,
    id,
    reference_number,
    remarks,
  } = useLocalSearchParams<{
    title: string;
    description: string;
    category: string;
    type: string;
    fileName: string;
    id: string;
    reference_number: string;
    remarks: string;
  }>();

  const { recipients } = useLocalSearchParams<{ recipients: string }>();

  const ids = useMemo(() => {
    if (!recipients) return [];
    try {
      return JSON.parse(recipients) as string[];
    } catch {
      return String(recipients).split(",").filter(Boolean);
    }
  }, [recipients]);

  const { nameIndex } = useContactsOptions();
  const recipientNames = ids
    .map((id) => nameIndex[id])
    .filter(Boolean)
    .join(", ");

  usePrefetchContactDetails(ids);

  const [isUploading, setIsUploading] = useState(false);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleUpload = async () => {
    setIsUploading(true);
    try {
      const fileExt =
        String(fileName ?? "")
          .split(".")
          .pop()
          ?.toLowerCase() ?? "";

      // const saved = await addDocument({
      //   documentName: String(title ?? ""),
      //   description: String(description ?? ""),
      //   category: String(category ?? ""),
      //   type: String(type ?? ""),
      //   fileName: String(fileName ?? ""),
      //   fileExtension: fileExt,
      //   recipients: ids,
      // });

      await sleep(4000);
      router.replace({
        pathname: "/return-message",
        params: {
          mode: "success",
          transactionId:
            "0xd58d35bf1ca98c9d4d1e19cc16b4985e89c09c9cfa90b6ce4b287e7eae545c43",
        },
      });
    } catch {
      router.replace({
        pathname: "/return-message",
        params: { mode: "error" },
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isUploading && (
        <LoadingOverlay
          visible={isUploading}
          label="Uploading..."
          onDismiss={() => {}}
        />
      )}
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        <ScrollView
          className="bg-white"
          contentContainerClassName="items-center"
        >
          {/* Header */}
          <View className="flex-row items-center justify-start gap-2 w-full px-4 ">
            <BackButton />
            <Text className="text-2xl font-bold py-4">
              Preview Document Details
            </Text>
          </View>

          {/* Form preview */}
          <View className="flex-col gap-4 w-[80%]">
            {/* Category */}
            <View className="flex-col gap-1">
              <Label className="text-black">Category</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={category as string}
                editable={false}
              />
            </View>

            {/* Type */}
            <View className="flex-col gap-1">
              <Label className="text-black">Type</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={type as string}
                editable={false}
              />
            </View>

            {/* Title */}
            <View className="flex-col gap-1">
              <Label className="text-black">Title</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={title as string}
                editable={false}
              />
            </View>

            {/* ID */}
            <View className="flex-col gap-1">
              <Label className="text-black">ID</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={id as string}
                editable={false}
              />
            </View>

            {/* Reference Number */}
            <View className="flex-col gap-1">
              <Label className="text-black">Reference Number</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={reference_number as string}
                editable={false}
              />
            </View>

            {/* Recipients */}
            <View className="flex-col gap-1">
              <Label className="text-black">Recipients</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                value={recipientNames}
                editable={false}
              />
            </View>

            {/* Description */}
            <View className="flex-col gap-1">
              <Label className="text-black">Description</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                value={description as string}
                editable={false}
              />
            </View>

            {/* Remarks */}
            <View className="flex-col gap-1">
              <Label className="text-black">Remarks</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                value={remarks as string}
                editable={false}
              />
            </View>
          </View>

          {/* Selected document */}
          <View className="mt-12 mb-4 w-[80%] flex items-center justify-center">
            <Text className="text-black font-bold text-2xl">
              Selected document
            </Text>

            <View className="flex-row gap-2 items-center bg-gray-100 p-3 w-full my-2">
              <AntDesign name="file" size={20} color="#438BF7" />
              <Text className="text-black font-bold text-lg">{fileName}</Text>
            </View>
          </View>

          {/* Footer */}
          <Button
            className="w-[80%] self-center bg-button"
            onPress={handleUpload}
            disabled={isUploading}
          >
            <Text className="font-bold text-white">Confirm & Upload</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
