import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { BackButton } from "~/components/back-button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "~/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getDocumentById,
  StoredDocument,
  updateDocument,
} from "~/lib/storage/document";
import { getContactById, StoredContact } from "~/lib/storage/contact";

export default function EditDocument() {
  const { documentId } = useLocalSearchParams<{ documentId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [doc, setDoc] = useState<StoredDocument | null>(null);
  const [recipientContacts, setRecipientContacts] = useState<StoredContact[]>(
    []
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!documentId) return;
      const found = await getDocumentById(String(documentId));
      if (cancelled) return;
      setDoc(found);
      setDescription(found?.description ?? "");

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

  const recipientsText = useMemo(
    () => recipientContacts.map((c) => c.fullName).join(", "),
    [recipientContacts]
  );

  function formatDateLong(ts: number) {
    const d = new Date(ts);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function handleEdit() {
    setIsEditing(true);
  }

  async function handleSave() {
    if (!documentId || !doc) {
      setIsEditing(false);
      return;
    }
    const updated = await updateDocument(String(documentId), { description });
    if (updated) setDoc(updated);
    setIsEditing(false);
  }

  function handleCancel() {
    setDescription(doc?.description ?? "");
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
              <Textarea
                className="text-black bg-gray-300 opacity-100 border-0"
                placeholder="Recipients"
                value={recipientsText}
                editable={false}
              />
            </View>

            {/* Description */}
            <View className="flex-col gap-1">
              <Label className="text-black">Description</Label>
              <Textarea
                key={isEditing ? "editing" : "readonly"}
                className={`text-black opacity-100 border-0 ${
                  isEditing ? "bg-white border bored-gray-300" : "bg-gray-300"
                }`}
                placeholder="Enter Description"
                value={description}
                onChangeText={setDescription}
                editable={isEditing}
                autoFocus={isEditing}
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
                {doc?.documentName ?? ""}
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

          {/* Footer (edit wiring will be added later) */}
          {!isEditing ? (
            <Button
              className="w-[80%] self-center bg-button mt-8 mb-12"
              onPress={handleEdit}
            >
              <Text className="font-bold text-white">Edit Description</Text>
            </Button>
          ) : (
            <View className="flex-row gap-4 w-[80%] justify-center mt-8 mb-12">
              <Button className="bg-gray-200 flex-1" onPress={handleCancel}>
                <Text className="font-bold text-black">Cancel</Text>
              </Button>
              <Button className="bg-button flex-1" onPress={handleSave}>
                <Text className="font-bold text-white">Save</Text>
              </Button>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
