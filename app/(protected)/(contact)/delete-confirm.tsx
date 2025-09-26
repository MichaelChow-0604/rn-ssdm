import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { toast } from "sonner-native";
import { Button } from "~/components/ui/button";
import { deleteContact } from "~/lib/http/endpoints/contact";
import { contactKeys } from "~/lib/http/keys/contact";
import { DeleteContactResponse } from "~/lib/http/response-type/contact";
import { useApiMutation } from "~/lib/http/use-api-mutation";

export default function DeleteConfirm() {
  const params = useLocalSearchParams();

  const queryClient = useQueryClient();

  const id = String(params.id ?? "");
  const canDelete = String(params.canDelete ?? "false");

  const blockedDocs = Array.isArray(params.blockedDocs)
    ? (params.blockedDocs as string[])
    : typeof params.blockedDocs === "string"
    ? params.blockedDocs.length
      ? [params.blockedDocs]
      : []
    : [];

  const RelatedDocs = Array.isArray(params.RelatedDocs)
    ? (params.RelatedDocs as string[])
    : typeof params.RelatedDocs === "string"
    ? params.RelatedDocs.length
      ? [params.RelatedDocs]
      : []
    : [];

  const deleteContactMutation = useApiMutation<DeleteContactResponse, string>({
    mutationKey: ["contact", "delete"],
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.list() });
      queryClient.removeQueries({ queryKey: contactKeys.detail(String(id)) });
      router.replace("/contact-list");
      toast.success("Contact deleted successfully.");
    },
    onError: () =>
      toast.error("Failed to delete contact. Please try again later."),
  });

  async function handleDelete() {
    if (canDelete !== "true") return;
    deleteContactMutation.mutate(String(id));
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

      {/* This contact is the ONLY recipient of the following document(s) */}
      {blockedDocs.length > 0 ? (
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            You cannot delete this contact.
          </Text>

          <Text className="text-center text-sm text-redtext">
            This contact is the only recipient of the following document(s):
          </Text>

          <Text className="text-center text-sm text-redtext font-bold">
            {blockedDocs}
          </Text>

          <Text className="text-center text-sm text-redtext">
            Please add another recipient to those document(s) before deleting
            this contact.
          </Text>
        </View>
      ) : RelatedDocs.length > 0 ? (
        // This contact is the recipient of the following document(s)
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            This contact is the recipient of the following documents:
          </Text>
          <Text className="text-center text-sm text-redtext font-bold">
            {RelatedDocs}
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
          className={canDelete === "true" ? "bg-button" : "bg-gray-300"}
          disabled={canDelete !== "true"}
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
