import { Controller } from "react-hook-form";
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
import { Feather } from "@expo/vector-icons";
import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/back-button";
import { Textarea } from "~/components/ui/textarea";
import { RecipientsMultiSelect } from "~/components/documents/recipient-multi-select";
import { SelectDropdown } from "~/components/select-dropdown";
import { CATEGORIES, TYPES } from "~/constants/select-data";
import { AlertDialog } from "~/components/pop-up/alert-dialog";
import { useUploadDocumentForm } from "~/hooks/document/use-upload-document-form";

export default function UploadDocument() {
  const {
    control,
    errors,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedContacts,
    setSelectedContacts,
    selectedFile,
    setSelectedFile,
    fileReachedMaxSize,
    setFileReachedMaxSize,
    contactOptions,
    onSubmit,
    handleChooseFile,
  } = useUploadDocumentForm();

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
          <AlertDialog
            visible={fileReachedMaxSize}
            title="Reached maximum upload size limit"
            label={`Please select a file with a size less than 25MB.`}
            onDismiss={() => {
              setSelectedFile(null);
              setFileReachedMaxSize(false);
            }}
          />

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
                    autoCapitalize="none"
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
                    autoCapitalize="none"
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

              {errors.recipients && (
                <Text className="text-redtext text-sm">
                  {errors.recipients.message}
                </Text>
              )}
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
                    autoCapitalize="none"
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
                    autoCapitalize="none"
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
              Support JPG, JPEG, PNG, HEIC, PDF, DOC, DOCX formats. Maximum file
              size: 25MB.
            </Text>
          </View>

          {/* Button container */}
          <Button
            className="w-[80%] my-8 bg-button"
            onPress={onSubmit}
            disabled={!selectedFile}
          >
            <Text className="font-bold text-white">Preview</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
