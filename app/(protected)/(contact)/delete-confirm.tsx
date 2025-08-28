import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { useDeleteContact } from "~/hooks/use-delete-contact";

export default function DeleteConfirm() {
  const { id } = useLocalSearchParams();
  const contactId = String(id ?? "");

  const { blockedDocNames, affectedNames, canDelete, deleteContactAndCleanup } =
    useDeleteContact(contactId);

  async function handleDelete() {
    if (!canDelete) return;
    await deleteContactAndCleanup();

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
