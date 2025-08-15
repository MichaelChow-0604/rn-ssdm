import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BackButton } from "~/components/back-button";
import { router, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { getContactById, StoredContact } from "~/lib/storage/contact";
import { useMemo, useEffect, useState, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import { addDocument } from "~/lib/storage/document";

export default function PreviewDocument() {
  const { documentName, description, category, type, fileName } =
    useLocalSearchParams<{
      documentName: string;
      description: string;
      category: string;
      type: string;
      fileName: string;
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

  function formatDateLong(ts: number) {
    const d = new Date(ts);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

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

      const saved = await addDocument({
        documentName: String(documentName ?? ""),
        description: String(description ?? ""),
        category: String(category ?? ""),
        type: String(type ?? ""),
        fileName: String(fileName ?? ""),
        fileExtension: fileExt,
        recipients: ids,
      });

      await sleep(3000);

      router.replace({
        pathname: "/return-message",
        params: {
          mode: "success",
          transactionId: saved.transactionId,
          uploadDate: formatDateLong(saved.uploadDate),
          uploadTime: saved.uploadTime,
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

  function UploadingOverlay({ visible }: { visible: boolean }) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(opacity, {
        toValue: visible ? 0.7 : 0,
        duration: 300,
        useNativeDriver: true, // animates opacity on UI thread
      }).start();
    }, [visible]);

    return (
      <View
        pointerEvents={visible ? "auto" : "none"}
        style={[StyleSheet.absoluteFillObject, { zIndex: 50 }]}
      >
        {/* Dim-only layer */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: "black", opacity },
          ]}
        />
        {/* Foreground content (not dimmed) */}
        <View
          style={[StyleSheet.absoluteFillObject]}
          className="items-center justify-center"
        >
          <ActivityIndicator size="large" color="#438BF7" />
          <Text className="text-white font-bold text-2xl">Uploading...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {isUploading && <UploadingOverlay visible={isUploading} />}
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
              <Textarea
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
