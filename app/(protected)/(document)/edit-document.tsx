import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "~/components/back-button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  beautifyResponse,
  formatIsoToDDMMYYYY,
  formatIsoToHKTTime,
} from "~/lib/utils";
import { RecipientsMultiSelect } from "~/components/documents/recipient-multi-select";
import { useQuery } from "@tanstack/react-query";
import { documentKeys } from "~/lib/http/keys/document";
import { useContactsOptions } from "~/lib/contacts/hooks";
import { Controller, useForm } from "react-hook-form";
import { editDocumentSchema } from "~/schema/edit-document-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDocumentById } from "~/lib/http/endpoints/document";

type EditDocumentFormFields = z.infer<typeof editDocumentSchema>;

export default function EditDocument() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: documentKeys.detail(String(documentId)),
    queryFn: () => getDocumentById(String(documentId)),
  });

  const { options: contactOptions, nameIndex } = useContactsOptions();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EditDocumentFormFields>({
    defaultValues: {
      id: "",
      reference_number: "",
      description: "",
      remarks: "",
      recipients: [],
    },
    resolver: zodResolver(editDocumentSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      id: data.userDocId ?? "",
      reference_number: data.referenceNo ?? "",
      description: data.description ?? "",
      remarks: data.remarks ?? "",
      recipients: (data.recipients ?? []).map(String),
    });
  }, [data, reset]);

  const currentRecipients = watch("recipients") ?? [];
  const contactsReady = Object.keys(nameIndex).length > 0;

  const recipientIds = isEditing ? currentRecipients : data?.recipients ?? [];

  const recipientNames = contactsReady
    ? recipientIds
        .map((id) => nameIndex[id])
        .filter(Boolean)
        .join(", ")
    : "";

  function handleEdit() {
    setIsEditing(true);
    setValue("recipients", (data?.recipients ?? []).map(String), {
      shouldDirty: false,
    });
  }

  async function handleSave() {
    // TODO: Implement Update Document
  }

  const category = data?.category ?? "";
  const type = data?.type ?? "";
  const title = data?.title ?? "";
  const userDocId = data?.userDocId ?? "";
  const referenceNumber = data?.referenceNo ?? "";
  const description = data?.description ?? "";
  const remarks = data?.remarks ?? "";
  const fileName = data?.fileName ?? "";
  const transactionId = data?.transactionId ?? "";

  console.log(beautifyResponse(data));

  const status = data?.status ?? "";
  const uploadDate = (() => {
    switch (status) {
      case "UPLOADED":
        return formatIsoToDDMMYYYY(data?.updatedAt ?? "");
      case "PROCESSING":
        return "Pending";
      default:
        return "Please reupload";
    }
  })();

  const uploadTime = (() => {
    switch (status) {
      case "UPLOADED":
        return formatIsoToHKTTime(data?.updatedAt ?? "");
      case "PROCESSING":
        return "Pending";
      default:
        return "Please reupload";
    }
  })();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#438BF7" />
          </View>
        ) : (
          <ScrollView
            className="bg-white"
            contentContainerClassName="items-center pb-12"
          >
            {/* Header */}
            <View className="flex-row items-center justify-start gap-2 w-full px-4 ">
              <BackButton />
              <Text className="text-2xl font-bold py-4">Document Details</Text>

              <Button
                className="bg-button ml-auto"
                onPress={isEditing ? handleSave : handleEdit}
                size="sm"
              >
                <Text className="font-bold text-white">
                  {isEditing ? "Save" : "Edit"}
                </Text>
              </Button>
            </View>

            {/* Form preview */}
            <View className="flex-col gap-4 w-[80%]">
              {/* Category */}
              <View className="flex-col gap-1">
                <Label className="text-black">Category</Label>
                <Input
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  value={category}
                  editable={false}
                />
              </View>

              {/* Type */}
              <View className="flex-col gap-1">
                <Label className="text-black">Type</Label>
                <Input
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  value={type}
                  editable={false}
                />
              </View>

              {/* Title */}
              <View className="flex-col gap-1">
                <Label className="text-black">Title</Label>
                <Input
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  value={title}
                  editable={false}
                />
              </View>

              {/* ID */}
              <View className="flex-col gap-1">
                <Label className="text-black">ID</Label>
                {isEditing ? (
                  <Controller
                    name="id"
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Input
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        placeholderClassName="text-placeholder"
                        placeholder="Enter ID"
                        className="bg-white text-subtitle border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <Input
                    className="text-subtitle bg-gray-300 opacity-80 border-0"
                    value={userDocId}
                    editable={false}
                  />
                )}
                {errors.id && (
                  <Text className="text-redtext text-sm">
                    {errors.id.message}
                  </Text>
                )}
              </View>

              {/* Reference Number */}
              <View className="flex-col gap-1">
                <Label className="text-black">Reference Number</Label>
                {isEditing ? (
                  <Controller
                    name="reference_number"
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Input
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        placeholderClassName="text-placeholder"
                        placeholder="Enter Reference Number"
                        className="bg-white text-subtitle border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <Input
                    className="text-subtitle bg-gray-300 opacity-80 border-0"
                    value={referenceNumber}
                    editable={false}
                  />
                )}
                {errors.reference_number && (
                  <Text className="text-redtext text-sm">
                    {errors.reference_number.message}
                  </Text>
                )}
              </View>

              {/* Recipients */}
              <View className="flex-col gap-1">
                <Label className="text-black">Recipients</Label>
                {isEditing ? (
                  <Controller
                    name="recipients"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <RecipientsMultiSelect
                        key={`recipients-${contactOptions.length}`}
                        options={contactOptions}
                        value={(value ?? []).map(String)}
                        onChange={(v) => onChange(v)}
                      />
                    )}
                  />
                ) : (
                  <Textarea
                    className="text-subtitle bg-gray-300 opacity-80 border-0"
                    placeholder="Recipients"
                    value={recipientNames}
                    editable={false}
                  />
                )}
                {errors.recipients && (
                  <Text className="text-redtext text-sm">
                    {errors.recipients.message}
                  </Text>
                )}
              </View>

              {/* Description */}
              <View className="flex-col gap-1">
                <Label className="text-black">Description</Label>
                {isEditing ? (
                  <Controller
                    name="description"
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Textarea
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        placeholderClassName="text-placeholder"
                        placeholder="Enter Description"
                        className="bg-white text-subtitle border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <Textarea
                    className="text-subtitle bg-gray-300 opacity-80 border-0"
                    value={description}
                    editable={false}
                  />
                )}
              </View>

              {/* Remarks */}
              <View className="flex-col gap-1">
                <Label className="text-black">Remarks</Label>
                {isEditing ? (
                  <Controller
                    name="remarks"
                    control={control}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Textarea
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCorrect={false}
                        placeholderClassName="text-placeholder"
                        placeholder="Enter Remarks"
                        className="bg-white text-subtitle border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <Textarea
                    className="text-subtitle bg-gray-300 opacity-80 border-0"
                    value={remarks}
                    editable={false}
                  />
                )}
              </View>
            </View>

            {/* Selected document */}
            <View className="mt-8 mb-4 w-[80%] flex items-center justify-center">
              <Text className="text-black font-bold text-2xl">
                Selected document
              </Text>

              <View className="flex-row gap-2 items-center bg-gray-100 p-3 w-full my-2">
                <AntDesign name="file" size={20} color="#438BF7" />
                <Text className="text-black font-bold text-lg">{fileName}</Text>
              </View>
            </View>

            <View className="flex-col gap-4 w-[80%]">
              {/* Transaction ID */}
              <View className="flex-col gap-1">
                <Label className="text-black">Transaction ID</Label>
                <Textarea
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  placeholder="Enter Transaction ID"
                  value={transactionId}
                  editable={false}
                />
              </View>

              {/* Upload Date */}
              <View className="flex-col gap-1">
                <Label className="text-black">Upload Date</Label>
                <Input
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  placeholder="Enter Upload Date"
                  value={uploadDate}
                  editable={false}
                />
              </View>

              {/* Upload Time */}
              <View className="flex-col gap-1">
                <Label className="text-black">Upload Time</Label>
                <Input
                  className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
                  placeholder="Enter Upload Time"
                  value={uploadTime}
                  editable={false}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
