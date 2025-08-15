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

export default function DeleteConfirm() {
  const { id } = useLocalSearchParams();
  const contactId = String(id ?? "");

  const [affectedDocs, setAffectedDocs] = useState<StoredDocument[]>([]);
  const [blockedDocs, setBlockedDocs] = useState<StoredDocument[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!contactId) return;
      const docs = await getDocuments();
      const affected = docs.filter((d) => d.recipients?.includes(contactId));
      const blocked = affected.filter(
        (d) => (d.recipients?.filter(Boolean).length ?? 0) === 1
      );

      if (!cancelled) {
        setAffectedDocs(affected);
        setBlockedDocs(blocked);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [contactId]);

  const canDelete = blockedDocs.length === 0;

  async function handleDelete() {
    if (!contactId || !canDelete) {
      return;
    }

    await removeContact(contactId);

    if (affectedDocs.length) {
      await Promise.all(
        affectedDocs.map((d) =>
          updateDocument(d.id, {
            recipients: (d.recipients ?? []).filter((r) => r !== contactId),
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

      {blockedDocs.length > 0 ? (
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            You cannot delete this contact.
          </Text>

          <Text className="text-center text-sm text-redtext">
            This contact is the only recipient of the following document(s):
          </Text>

          <Text className="text-center text-sm text-redtext font-bold">
            {blockedDocs.map((d) => d.documentName).join(", ")}
          </Text>

          <Text className="text-center text-sm text-redtext">
            Please add another recipient to those document(s) before deleting
            this contact.
          </Text>
        </View>
      ) : affectedDocs.length > 0 ? (
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            This contact is the recipient of the following documents:
          </Text>
          <Text className="text-center text-sm text-redtext font-bold">
            {affectedDocs.map((d) => d.documentName).join(", ")}
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
