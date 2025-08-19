import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { removeContact } from "~/lib/storage/contact";
import {
  getDocuments,
  StoredDocument,
  updateDocument,
} from "~/lib/storage/document";
import {
  getTrash,
  TrashedDocument,
  updateTrashedDocument,
} from "~/lib/storage/trash";

export default function DeleteConfirm() {
  const { id } = useLocalSearchParams();
  const contactId = String(id ?? "");

  const [affectedActiveDocs, setAffectedActiveDocs] = useState<
    StoredDocument[]
  >([]);
  const [affectedTrashedDocs, setAffectedTrashedDocs] = useState<
    TrashedDocument[]
  >([]);
  const [blockedDocNames, setBlockedDocNames] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!contactId) return;
      const [docs, trash] = await Promise.all([getDocuments(), getTrash()]);

      const affectedActive = docs.filter((d) =>
        d.recipients?.includes(contactId)
      );
      const affectedTrash = trash.filter((t) =>
        t.recipients?.includes(contactId)
      );

      const blockedActive = affectedActive.filter(
        (d) => (d.recipients?.filter(Boolean).length ?? 0) === 1
      );
      const blockedTrash = affectedTrash.filter(
        (t) => (t.recipients?.filter(Boolean).length ?? 0) === 1
      );

      if (!cancelled) {
        setAffectedActiveDocs(affectedActive);
        setAffectedTrashedDocs(affectedTrash);
        setBlockedDocNames([
          ...blockedActive.map((d) => d.documentName),
          ...blockedTrash.map((t) => t.documentName),
        ]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const canDelete = blockedDocNames.length === 0;
  const affectedNames = [
    ...affectedActiveDocs.map((d) => d.documentName),
    ...affectedTrashedDocs.map((t) => t.documentName),
  ];

  async function handleDelete() {
    if (!contactId || !canDelete) {
      return;
    }

    await removeContact(contactId);

    if (affectedActiveDocs.length) {
      await Promise.all(
        affectedActiveDocs.map((d) =>
          updateDocument(d.id, {
            recipients: (d.recipients ?? []).filter((r) => r !== contactId),
          })
        )
      );
    }

    if (affectedTrashedDocs.length) {
      await Promise.all(
        affectedTrashedDocs.map((t) =>
          updateTrashedDocument(t.id, {
            recipients: (t.recipients ?? []).filter((r) => r !== contactId),
          })
        )
      );
    }

    router.replace("/contact-list");
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={require("~/assets/images/delete_alert.png")}
        className="w-20 h-20 my-4"
      />
      <Text className="text-xl font-semibold text-center w-[80%]">
        Are you sure you want to delete this contact person?
      </Text>

      {blockedDocNames.length > 0 ? (
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            You cannot delete this contact.
          </Text>

          <Text className="text-center text-sm text-redtext">
            This contact is the only recipient of the following document(s):
          </Text>

          <Text className="text-center text-sm text-redtext font-bold">
            {blockedDocNames.join(", ")}
          </Text>

          <Text className="text-center text-sm text-redtext">
            Please add another recipient to those document(s) before deleting
            this contact.
          </Text>
        </View>
      ) : affectedNames.length > 0 ? (
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            This contact is the recipient of the following documents:
          </Text>
          <Text className="text-center text-sm text-redtext font-bold">
            {affectedNames.join(", ")}
          </Text>
          <Text className="text-center text-sm text-redtext">
            Proceeding will automatically remove this contact from those
            documents' recipient field.
          </Text>
        </View>
      ) : null}

      <View className="flex-col gap-4 pt-8 w-[60%]">
        <Button
          onPress={handleDelete}
          className={canDelete ? "bg-button" : "bg-gray-300"}
          disabled={!canDelete}
        >
          <Text className="text-white font-bold">YES, DELETE</Text>
        </Button>

        <Button
          variant="outline"
          onPress={() => router.back()}
          className="bg-white border-button active:bg-gray-100"
        >
          <Text className="text-button font-bold">NO, CANCEL</Text>
        </Button>
      </View>
    </View>
  );
}
