import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Option } from "~/components/ui/select";
import { uploadDocumentSchema } from "~/schema/upload-document-schema";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/back-button";
import { Textarea } from "~/components/ui/textarea";
import * as z from "zod";
import { RecipientsMultiSelect } from "~/components/documents/recipient-multi-select";
import { SelectDropdown } from "~/components/select-dropdown";
import { CATEGORIES, TYPES } from "~/constants/select-data";
import { useContactsOptions } from "~/lib/contacts/hooks";

type UploadDocumentFormFields = z.infer<typeof uploadDocumentSchema>;

interface FileInfo {
  uri: string;
  name: string;
  mimeType: string | undefined;
  size: number | undefined;
}

export default function UploadDocument() {
  const [selectedCategory, setSelectedCategory] = useState<Option>({
    label: "Legal",
    value: "LEGAL",
  });
  const [selectedType, setSelectedType] = useState<Option>({
    label: "Will",
    value: "WILL",
  });

  const { options: contactOptions } = useContactsOptions();
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);

  const handleChooseFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});

    if (!result.canceled) {
      const file = result.assets[0];
      setSelectedFile({
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      id: "",
      reference_number: "",
      remarks: "",
    },
    resolver: zodResolver(uploadDocumentSchema),
  });

  const watchedTitle = watch("title");
  const watchedId = watch("id");
  const hasTitle = !!watchedTitle?.trim();
  const hasId = !!watchedId?.trim();
  const hasRecipients = selectedContacts.length > 0;
  const hasFile = !!selectedFile;

  const isUploadDisabled = !(hasTitle && hasId && hasRecipients && hasFile);

  const onSubmit = (data: UploadDocumentFormFields) => {
    const previewData = {
      title: data.title,
      description: data.description,
      category: selectedCategory?.value,
      type: selectedType?.value,
      recipients: JSON.stringify(selectedContacts), // serialize
      userDocId: data.id,
      reference_number: data.reference_number,
      remarks: data.remarks,
      file: selectedFile,
    };

    router.push({
      pathname: "/preview-document",
      params: {
        previewData: JSON.stringify(previewData),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
              Document Detail Form
            </Text>
          </View>

          {/* Form */}
          <View className="flex-col gap-4 w-[80%]">
            {/* Category select dropdown */}
            <SelectDropdown
              label="Category"
              options={CATEGORIES}
              selectedOption={selectedCategory}
              setSelectedOption={setSelectedCategory}
            />

            {/* Type select dropdown */}
            <SelectDropdown
              label="Type"
              options={TYPES}
              selectedOption={selectedType}
              setSelectedOption={setSelectedType}
            />

            {/* Title */}
            <View className="flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Title</Label>
                <Text className="text-red-500 font-bold">*</Text>
              </View>
              <Controller
                name="title"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCorrect={false}
                    className="bg-white text-black border-gray-200"
                    placeholderClassName="text-placeholder"
                    placeholder="Enter Title"
                  />
                )}
              />

              {/* Last Name validation error */}
              {errors.title && (
                <Text className="text-redtext text-sm">
                  {errors.title.message}
                </Text>
              )}
            </View>

            {/* ID */}
            <View className="flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">ID</Label>
                <Text className="text-red-500 font-bold">*</Text>
              </View>
              <Controller
                name="id"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    autoCorrect={false}
                    className="bg-white text-black border-gray-200"
                    placeholderClassName="text-placeholder"
                    placeholder="Enter ID"
                  />
                )}
              />

              {/* ID validation error */}
              {errors.id && (
                <Text className="text-redtext text-sm">
                  {errors.id.message}
                </Text>
              )}
            </View>

            {/* Reference Number */}
            <View className="flex-col gap-1">
              <Label className="text-black">Reference Number</Label>
              <Controller
                name="reference_number"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
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

              {/* Reference Number validation error */}
              {errors.reference_number && (
                <Text className="text-redtext text-sm">
                  {errors.reference_number.message}
                </Text>
              )}
            </View>

            {/* Recipients multi select */}
            <View className="w-full flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Recipients</Label>
                <Text className="text-red-500 font-bold">*</Text>

                <View className="flex-row gap-1 items-center ml-auto">
                  <Feather name="alert-circle" color="black" />
                  <Text className="text-sm font-semibold text-subtitle">
                    Up to 5 recipients
                  </Text>
                </View>
              </View>

              <RecipientsMultiSelect
                options={contactOptions}
                value={selectedContacts}
                onChange={setSelectedContacts}
              />
            </View>

            {/* Description */}
            <View className="flex-col gap-1">
              <Label className="text-black">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
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
            </View>

            {/* Remarks */}
            <View className="flex-col gap-1">
              <Label className="text-black">Remarks</Label>
              <Controller
                name="remarks"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
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
            </View>
          </View>

          {/* Upload document */}
          <View className="w-[80%] mt-4">
            {/* Title */}
            <View className="flex-row gap-2 items-center justify-center py-4">
              <Feather name="upload-cloud" size={24} color="black" />
              <Text className="text-2xl font-bold">Upload Document</Text>
            </View>

            <Text className="font-bold text-lg text-gray-600">
              Select Document
            </Text>

            <View className="flex-row gap-3 p-3 border border-gray-300 rounded-lg mt-2 items-center bg-gray-100">
              <Button className="w-auto bg-blue-100" onPress={handleChooseFile}>
                <Text className="text-button font-bold">Choose file</Text>
              </Button>

              {selectedFile ? (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-gray-600 font-semibold">
                    {selectedFile.name}
                  </Text>
                </View>
              ) : (
                <Text className="text-gray-600 font-semibold">
                  No file chosen
                </Text>
              )}
            </View>

            <Text className="text-subtitle text-sm my-2 font-semibold">
              Support JPG, PDF, WORD, EXCEL, PNG formats. Maximum file size:
              25MB.
            </Text>
          </View>

          {/* Button container */}
          <Button
            className={`w-[80%] my-8 ${
              isUploadDisabled ? "bg-gray-300" : "bg-button"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isUploadDisabled}
          >
            <Text
              className={`font-bold ${
                isUploadDisabled ? "text-gray-500" : "text-white"
              }`}
            >
              Preview
            </Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
