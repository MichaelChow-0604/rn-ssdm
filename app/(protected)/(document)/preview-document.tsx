import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { router, useLocalSearchParams } from "expo-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useMemo } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import {
  useContactsOptions,
  usePrefetchContactDetails,
} from "~/lib/contacts/hooks";
import { LoadingOverlay } from "~/components/loading-overlay";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import {
  FileData,
  UploadDocumentPayload,
} from "~/lib/http/request-type/document";
import { UploadDocumentResponse } from "~/lib/http/response-type/document";
import { uploadDocument } from "~/lib/http/endpoints/document";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "~/lib/http/keys/document";

interface PreviewData {
  title: string;
  description: string;
  category: string;
  type: string;
  recipients: string; // JSON stringified array of IDs
  userDocId: string;
  reference_number: string;
  remarks: string;
  file: FileData;
}

export default function PreviewDocument() {
  const { previewData } = useLocalSearchParams<{ previewData: string }>();
  const data: PreviewData = JSON.parse(String(previewData));

  const title = data?.title;
  const description = data?.description;
  const category = data?.category;
  const type = data?.type;
  const userDocId = data?.userDocId;
  const recipients = data?.recipients;
  const reference_number = data?.reference_number;
  const remarks = data?.remarks;
  const fileName = data?.file.name;

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

  const queryClient = useQueryClient();

  const uploadDocumentMutation = useApiMutation<
    UploadDocumentResponse,
    UploadDocumentPayload
  >({
    mutationKey: ["document", "upload"],
    mutationFn: uploadDocument,
    onSuccess: ({ transactionId }) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      router.replace({
        pathname: "/return-message",
        params: {
          mode: "success",
          transactionId,
        },
      });
    },
    onError: (err) => {
      console.log(err);
      router.replace({
        pathname: "/return-message",
        params: { mode: "error" },
      });
    },
  });

  const handleUpload = () => {
    uploadDocumentMutation.mutate({
      file: data.file,
      metadata: {
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        recipients: ids,
        userDocId: data.userDocId,
        referenceNo: data.reference_number,
        remarks: data.remarks,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {uploadDocumentMutation.isPending && (
        <LoadingOverlay
          visible={uploadDocumentMutation.isPending}
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
                value={category}
                editable={false}
              />
            </View>

            {/* Type */}
            <View className="flex-col gap-1">
              <Label className="text-black">Type</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={type}
                editable={false}
              />
            </View>

            {/* Title */}
            <View className="flex-col gap-1">
              <Label className="text-black">Title</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={title}
                editable={false}
              />
            </View>

            {/* User Doc ID */}
            <View className="flex-col gap-1">
              <Label className="text-black">ID</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={userDocId}
                editable={false}
              />
            </View>

            {/* Reference Number */}
            <View className="flex-col gap-1">
              <Label className="text-black">Reference Number</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                value={reference_number}
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
                value={description}
                editable={false}
              />
            </View>

            {/* Remarks */}
            <View className="flex-col gap-1">
              <Label className="text-black">Remarks</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                value={remarks}
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
            className="w-[80%] self-center bg-button mb-8"
            onPress={handleUpload}
            disabled={uploadDocumentMutation.isPending}
          >
            <Text className="font-bold text-white">Confirm & Upload</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
