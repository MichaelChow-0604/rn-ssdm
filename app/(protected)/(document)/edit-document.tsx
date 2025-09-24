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
import { router, useLocalSearchParams } from "expo-router";
import { RecipientsMultiSelect } from "~/components/documents/recipient-multi-select";
import { useQuery } from "@tanstack/react-query";
import { documentKeys } from "~/lib/http/keys/document";
import { useContactsOptions } from "~/lib/contacts/hooks";
import { Controller, useForm } from "react-hook-form";
import { editDocumentSchema } from "~/schema/edit-document-schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDocumentById } from "~/lib/http/endpoints/document";
import { getRecipientNames } from "~/lib/documents/utils";
import { toast } from "sonner-native";
import {
  ReadOnlyInput,
  ReadOnlyTextarea,
} from "~/components/documents/view-and-edit/readonly-fields";
import { toDocumentVM } from "~/lib/documents/mappers";

type EditDocumentFormFields = z.infer<typeof editDocumentSchema>;

export default function EditDocument() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch document details
  const { data, isLoading, isError } = useQuery({
    queryKey: documentKeys.detail(String(documentId)),
    queryFn: () => getDocumentById(String(documentId)),
    select: toDocumentVM,
  });

  // Fetch contacts for recipients name display
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

  // Auto-fill form with document details
  useEffect(() => {
    if (!data) return;
    reset({
      id: data.userDocId ?? "",
      reference_number: data.referenceNumber ?? "",
      description: data.description ?? "",
      remarks: data.remarks ?? "",
      recipients: (data.recipients ?? []).map(String),
    });
  }, [data, reset]);

  // Server error
  useEffect(() => {
    if (isError) toast.error("Something went wrong. Please try again later.");
  }, [isError]);

  // Map recipients for display in readonly fields
  const recipients = watch("recipients") ?? [];
  const contactsReady = Object.keys(nameIndex).length > 0;
  const viewRecipientIds = isEditing ? recipients : data?.recipients ?? [];
  const recipientNames = contactsReady
    ? getRecipientNames(viewRecipientIds.map(String), nameIndex)
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

  const EditingRecipients = (
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
  );

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
        ) : !data ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-redtext text-center font-medium">
              Document data not available.
            </Text>
            <Button
              className="bg-button rounded-full"
              onPress={() => router.back()}
            >
              <Text className="text-white font-bold">BACK</Text>
            </Button>
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

            {/* Form section */}
            <View className="flex-col gap-4 w-[80%]">
              {/* Category */}
              <View className="flex-col gap-1">
                <Label className="text-black">Category</Label>
                <ReadOnlyInput value={data.category} />
              </View>

              {/* Type */}
              <View className="flex-col gap-1">
                <Label className="text-black">Type</Label>
                <ReadOnlyInput value={data.type} />
              </View>

              {/* Title */}
              <View className="flex-col gap-1">
                <Label className="text-black">Title</Label>
                <ReadOnlyInput value={data.title} />
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
                        className="bg-white text-black border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <ReadOnlyInput value={data.userDocId} />
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
                        className="bg-white text-black border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <ReadOnlyInput value={data.referenceNumber} />
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
                  EditingRecipients
                ) : (
                  <ReadOnlyTextarea value={recipientNames} />
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
                        className="bg-white text-black border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <ReadOnlyTextarea value={data.description} />
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
                        className="bg-white text-black border-gray-200"
                      />
                    )}
                  />
                ) : (
                  <ReadOnlyTextarea value={data.remarks} />
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
                <Text className="text-black font-bold text-lg">
                  {data.fileName}
                </Text>
              </View>
            </View>

            <View className="flex-col gap-4 w-[80%]">
              {/* Transaction ID */}
              <View className="flex-col gap-1">
                <Label className="text-black">Transaction ID</Label>
                <ReadOnlyTextarea value={data.transactionId} />
              </View>

              {/* Upload Date */}
              <View className="flex-col gap-1">
                <Label className="text-black">Upload Date</Label>
                <ReadOnlyInput value={data.uploadDate} />
              </View>

              {/* Upload Time */}
              <View className="flex-col gap-1">
                <Label className="text-black">Upload Time</Label>
                <ReadOnlyInput value={data.uploadTime} />
              </View>
            </View>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
