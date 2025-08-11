import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BackButton } from "~/components/back-button";
import { router, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { getContactById, StoredContact } from "~/lib/storage/contact";
import { useMemo, useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";

export default function PreviewDocument() {
  const { documentName, description, category, type } = useLocalSearchParams<{
    documentName: string;
    description: string;
    category: string;
    type: string;
  }>();

  const { recipients } = useLocalSearchParams<{ recipients: string }>();
  const [recipientContacts, setRecipientContacts] = useState<StoredContact[]>(
    []
  );

  const ids = useMemo(() => {
    if (!recipients) return [];
    try {
      return JSON.parse(recipients) as string[];
    } catch {
      return String(recipients).split(",").filter(Boolean);
    }
  }, [recipients]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.all(ids.map((id) => getContactById(id)));
      if (!cancelled)
        setRecipientContacts(results.filter(Boolean) as StoredContact[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      router.push("/return-message");
    }, 20000);
    setIsUploading(false);
  };

  function UploadingOverlay() {
    return (
      <View className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
        <ActivityIndicator size="large" color="#438BF7" />
        <Text className="text-white font-bold text-2xl">Uploading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <UploadingOverlay />
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
                placeholder="Enter Category"
                value={category as string}
                editable={false}
              />
            </View>

            {/* Type */}
            <View className="flex-col gap-1">
              <Label className="text-black">Type</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Type"
                value={type as string}
                editable={false}
              />
            </View>

            {/* Document Name */}
            <View className="flex-col gap-1">
              <Label className="text-black">Document Name</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Document Name"
                value={documentName as string}
                editable={false}
              />
            </View>

            {/* Recipients */}
            <View className="flex-col gap-1">
              <Label className="text-black">Recipients</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Recipients"
                value={recipientContacts.map((c) => c.fullName).join(", ")}
                editable={false}
              />
            </View>

            {/* Description */}
            <View className="flex-col gap-1">
              <Label className="text-black">Description</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Description"
                value={description as string}
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
              <AntDesign name="file1" size={20} color="#438BF7" />
              <Text className="text-black font-bold text-lg">
                {documentName}
              </Text>
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
