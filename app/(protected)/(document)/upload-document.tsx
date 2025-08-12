import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { uploadDocumentSchema } from "~/schema/upload-document";
import { AntDesign } from "@expo/vector-icons";
import { IMultiSelectRef, MultiSelect } from "react-native-element-dropdown";
import { getContacts } from "~/lib/storage/contact";
import { router, useFocusEffect } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "~/components/ui/button";
import { BackButton } from "~/components/back-button";
import { Textarea } from "~/components/ui/textarea";
import * as z from "zod";

interface MultiOption {
  label: string;
  value: string; // contact id
}

type UploadDocumentFormFields = z.infer<typeof uploadDocumentSchema>;

export default function UploadDocument() {
  const [selectedCategory, setSelectedCategory] = useState<Option>({
    label: "Legal",
    value: "legal",
  });
  const [selectedType, setSelectedType] = useState<Option>({
    label: "Will",
    value: "will",
  });

  const [contactOptions, setContactOptions] = useState<Option[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleChooseFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    setSelectedFile(result?.assets?.[0]?.name ?? null);
  };

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const contacts = await getContacts();
        if (cancelled) return;
        const opts = contacts.map((c) => ({
          label: c.fullName,
          value: c.id,
        }));
        setContactOptions(opts);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const renderItem = (item: MultiOption) => (
    <View style={styles.item}>
      <Text style={styles.selectedTextStyle}>{item.label}</Text>
    </View>
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      documentName: "",
      description: "",
    },
    resolver: zodResolver(uploadDocumentSchema),
  });

  const watchedDocumentName = watch("documentName");
  const hasDocName = !!watchedDocumentName?.trim();
  const hasRecipients = selectedContacts.length > 0;
  const hasFile = !!selectedFile;

  const isUploadDisabled = !(hasDocName && hasRecipients && hasFile);

  const onSubmit = (data: UploadDocumentFormFields) => {
    router.push({
      pathname: "/preview-document",
      params: {
        documentName: data.documentName,
        description: data.description,
        category: selectedCategory?.label,
        type: selectedType?.label,
        recipients: JSON.stringify(selectedContacts), // serialize
      },
    });
  };

  const multiRef = useRef<IMultiSelectRef>(null!);

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
            {/* Category */}
            <View className="flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Category</Label>
                <Text className="text-red-500 font-bold">*</Text>
              </View>
              <Select
                defaultValue={{ label: "Legal", value: "legal" }}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue
                    className="text-black font-medium text-lg"
                    placeholder="Select Category"
                  />
                </SelectTrigger>
                <SelectContent className="w-[80%] bg-white">
                  <SelectGroup>
                    <SelectItem
                      label="Legal"
                      value="legal"
                      className="active:bg-gray-100"
                    >
                      Legal
                    </SelectItem>
                    <SelectItem
                      label="Insurance"
                      value="insurance"
                      className="active:bg-gray-100"
                    >
                      Insurance
                    </SelectItem>
                    <SelectItem
                      label="Medical"
                      value="medical"
                      className="active:bg-gray-100"
                    >
                      Medical
                    </SelectItem>
                    <SelectItem
                      label="Financials"
                      value="financials"
                      className="active:bg-gray-100"
                    >
                      Financials
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Type */}
            <View className="flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Type</Label>
                <Text className="text-red-500 font-bold">*</Text>
              </View>
              <Select
                defaultValue={{ label: "Will", value: "will" }}
                value={selectedType}
                onValueChange={setSelectedType}
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue
                    className="text-black font-medium text-lg"
                    placeholder="Select Type"
                  />
                </SelectTrigger>
                <SelectContent className="w-[80%] bg-white">
                  <SelectGroup>
                    <SelectItem
                      label="Will"
                      value="will"
                      className="active:bg-gray-100"
                    >
                      Will
                    </SelectItem>
                    <SelectItem
                      label="Insurance Policy"
                      value="insurance-policy"
                      className="active:bg-gray-100"
                    >
                      Insurance Policy
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>

            {/* Document Name */}
            <View className="flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Document Name</Label>
                <Text className="text-red-500 font-bold">*</Text>
              </View>
              <Controller
                name="documentName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    className="bg-white text-black"
                    placeholderClassName="text-placeholder"
                    placeholder="Enter Document Name"
                  />
                )}
              />

              {/* Last Name validation error */}
              {errors.documentName && (
                <Text className="text-redtext text-sm">
                  {errors.documentName.message}
                </Text>
              )}
            </View>

            <View className="w-full flex-col gap-1">
              <View className="flex-row gap-0.5">
                <Label className="text-black">Recipients</Label>
                <Text className="text-red-500 font-bold">*</Text>

                <View className="flex-row gap-1 items-center ml-auto">
                  <AntDesign name="exclamationcircleo" color="black" />
                  <Text className="text-sm font-semibold text-subtitle">
                    Up to 5 recipients
                  </Text>
                </View>
              </View>

              <MultiSelect
                ref={multiRef}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={contactOptions}
                activeColor="#438BF7"
                labelField="label"
                valueField="value"
                placeholder="Select recipients"
                value={selectedContacts}
                maxSelect={5}
                search
                searchPlaceholder="Search..."
                onChange={(item: any) => {
                  setSelectedContacts(item);
                }}
                renderLeftIcon={() => (
                  <AntDesign
                    style={styles.icon}
                    color="black"
                    name="user"
                    size={20}
                  />
                )}
                renderInputSearch={(onSearch) => (
                  <View className="h-auto flex-row items-center p-1 gap-1">
                    <Input
                      className="flex-1"
                      placeholder="Search here"
                      onChangeText={onSearch}
                      autoCorrect={false}
                    />
                    <Button
                      className="w-[90px] bg-button"
                      onPress={() => multiRef.current?.close()}
                    >
                      <Text className="text-white font-bold">Confirm</Text>
                    </Button>
                  </View>
                )}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity
                    onPress={() => unSelect && unSelect(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.selectedStyle}>
                      <Text style={styles.textSelectedStyle}>{item.label}</Text>
                      <MaterialIcons
                        name="delete-forever"
                        size={20}
                        color="white"
                      />
                    </View>
                  </TouchableOpacity>
                )}
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
                    placeholderClassName="text-placeholder"
                    placeholder="Enter Description"
                    className="bg-white text-black"
                  />
                )}
              />
            </View>
          </View>

          {/* Upload document */}
          <View className="w-[80%] mt-4">
            {/* Title */}
            <View className="flex-row gap-2 items-center justify-center py-4">
              <AntDesign name="clouduploado" size={24} color="black" />
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
                <Text className="text-gray-600 font-semibold">
                  {selectedFile}
                </Text>
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

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#438BF7",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
