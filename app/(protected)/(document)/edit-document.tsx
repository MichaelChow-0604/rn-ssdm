import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BackButton } from "~/components/back-button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getDocumentById,
  StoredDocument,
  updateDocument,
} from "~/lib/storage/document";
import {
  getContactById,
  getContacts,
  StoredContact,
} from "~/lib/storage/contact";
import { IMultiSelectRef, MultiSelect } from "react-native-element-dropdown";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EditAlert } from "~/components/pop-up/edit-alert";
import { formatDateLong } from "~/lib/utils";
import { MultiOption } from "~/lib/types";
import { multiSelectStyles } from "~/components/documents/multi-select-style";

export default function EditDocument() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [doc, setDoc] = useState<StoredDocument | null>(null);
  const [recipientContacts, setRecipientContacts] = useState<StoredContact[]>(
    []
  );
  const [description, setDescription] = useState("");

  const [contactOptions, setContactOptions] = useState<MultiOption[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const multiRef = useRef<IMultiSelectRef>(null!);

  const [editAlertOpen, setEditAlertOpen] = useState(false);

  // Load document
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!documentId) return;
      const found = await getDocumentById(String(documentId));
      if (cancelled) return;
      setDoc(found);
      setDescription(found?.description ?? "");
      setSelectedRecipients(found?.recipients ?? []);

      if (found?.recipients?.length) {
        const contacts = await Promise.all(
          found.recipients.map((id) => getContactById(id))
        );
        if (!cancelled) {
          setRecipientContacts(contacts.filter(Boolean) as StoredContact[]);
        }
      } else {
        setRecipientContacts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  // Load all contacts as options
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await getContacts();
      if (cancelled) return;
      setContactOptions(all.map((c) => ({ label: c.fullName, value: c.id })));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const recipientsText = useMemo(
    () => recipientContacts.map((c) => c.fullName).join(", "),
    [recipientContacts]
  );

  function handleEdit() {
    setIsEditing(true);
  }

  async function handleSave() {
    if (!documentId || !doc) {
      setIsEditing(false);
      return;
    }

    // Check if no recipients are selected
    if (selectedRecipients.length === 0) {
      setEditAlertOpen(true);
      return;
    }

    const updated = await updateDocument(String(documentId), {
      description,
      recipients: selectedRecipients,
    });

    if (updated) {
      setDoc(updated);
      if (updated.recipients?.length) {
        const contacts = await Promise.all(
          updated.recipients.map((id) => getContactById(id))
        );
        setRecipientContacts(contacts.filter(Boolean) as StoredContact[]);
      }
    }
    setIsEditing(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
      >
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
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Category"
                value={doc?.category ?? ""}
                editable={false}
              />
            </View>

            {/* Type */}
            <View className="flex-col gap-1">
              <Label className="text-black">Type</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Type"
                value={doc?.type ?? ""}
                editable={false}
              />
            </View>

            {/* Document Name */}
            <View className="flex-col gap-1">
              <Label className="text-black">Document Name</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Document Name"
                value={doc?.documentName ?? ""}
                editable={false}
              />
            </View>

            {/* Recipients */}
            <View className="flex-col gap-1">
              <Label className="text-black">Recipients</Label>
              {isEditing ? (
                <MultiSelect
                  ref={multiRef}
                  style={multiSelectStyles.dropdown}
                  placeholderStyle={multiSelectStyles.placeholderStyle}
                  selectedTextStyle={multiSelectStyles.selectedTextStyle}
                  inputSearchStyle={multiSelectStyles.inputSearchStyle}
                  iconStyle={multiSelectStyles.iconStyle}
                  data={contactOptions}
                  activeColor="#438BF7"
                  labelField="label"
                  valueField="value"
                  placeholder="Select recipients"
                  value={selectedRecipients}
                  maxSelect={5}
                  search
                  searchPlaceholder="Search..."
                  onChange={(vals: any) => setSelectedRecipients(vals)}
                  renderLeftIcon={() => (
                    <AntDesign
                      style={multiSelectStyles.icon}
                      color="black"
                      name="user"
                      size={20}
                    />
                  )}
                  renderItem={(item: MultiOption) => (
                    <View style={multiSelectStyles.item}>
                      <Text style={multiSelectStyles.selectedTextStyle}>
                        {item.label}
                      </Text>
                    </View>
                  )}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity
                      onPress={() => unSelect && unSelect(item)}
                      activeOpacity={0.8}
                    >
                      <View style={multiSelectStyles.selectedStyle}>
                        <Text style={multiSelectStyles.textSelectedStyle}>
                          {item.label}
                        </Text>
                        <MaterialIcons
                          name="delete-forever"
                          size={20}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  renderInputSearch={(onSearch) => (
                    <View className="h-auto flex-row items-center p-1 gap-1">
                      <Input
                        className="flex-1 bg-white border-gray-200"
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
                />
              ) : (
                <Textarea
                  className="text-black bg-gray-300 opacity-100 border-0"
                  placeholder="Recipients"
                  value={recipientsText}
                  editable={false}
                />
              )}
            </View>

            {/* Description */}
            <View className="flex-col gap-1">
              <Label className="text-black">Description</Label>
              <Textarea
                key={isEditing ? "editing" : "readonly"}
                className={`text-black opacity-100 border-0 ${
                  isEditing ? "bg-white border border-gray-200" : "bg-gray-300"
                }`}
                value={description}
                onChangeText={setDescription}
                editable={isEditing}
              />
            </View>
          </View>

          {/* Selected document */}
          <View className="mt-8 mb-4 w-[80%] flex items-center justify-center">
            <Text className="text-black font-bold text-2xl">
              Selected document
            </Text>

            <View className="flex-row gap-2 items-center bg-gray-100 p-3 w-full my-2">
              <AntDesign name="file1" size={20} color="#438BF7" />
              <Text className="text-black font-bold text-lg">
                {doc?.fileName ?? ""}
              </Text>
            </View>
          </View>

          <View className="flex-col gap-4 w-[80%]">
            {/* Transaction ID */}
            <View className="flex-col gap-1">
              <Label className="text-black">Transaction ID</Label>
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Transaction ID"
                value={doc?.transactionId ?? ""}
                editable={false}
              />
            </View>

            {/* Upload Date */}
            <View className="flex-col gap-1">
              <Label className="text-black">Upload Date</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Upload Date"
                value={doc ? formatDateLong(doc.uploadDate) : ""}
                editable={false}
              />
            </View>

            {/* Upload Time */}
            <View className="flex-col gap-1">
              <Label className="text-black">Upload Time</Label>
              <Input
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Enter Upload Time"
                value={doc?.uploadTime ?? ""}
                editable={false}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <EditAlert visible={editAlertOpen} setOpen={setEditAlertOpen} />
    </SafeAreaView>
  );
}
