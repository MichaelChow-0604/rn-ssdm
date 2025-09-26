import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ActivityIndicator } from "react-native";
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

  function toStringArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map((v) => String(v));
    if (typeof value === "string") {
      if (!value) return [];
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map((v) => String(v));
      } catch {}
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  const blockedDocs = toStringArray(params.blockedDocs);
  const relatedDocs = toStringArray(params.relatedDocs);

  function formatDocsList(docs: string[]): string {
    const parts = docs
      .flatMap((d) => String(d).split(","))
      .map((s) => s.trim().replace(/,+$/g, ""))
      .filter(Boolean);
    return parts.join(", ");
  }

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

  const isDeletingContact =
    deleteContactMutation.isPending || deleteContactMutation.isSuccess;

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
            {formatDocsList(blockedDocs)}
          </Text>

          <Text className="text-center text-sm text-redtext">
            Please add another recipient to those document(s) before deleting
            this contact.
          </Text>
        </View>
      ) : relatedDocs.length > 0 ? (
        // This contact is the recipient of the following document(s)
        <View className="flex-col gap-1 w-[90%] mt-4">
          <Text className="text-center text-sm text-redtext">
            This contact is the recipient of the following documents:
          </Text>
          <Text className="text-center text-sm text-redtext font-bold">
            {formatDocsList(relatedDocs)}
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
          disabled={canDelete !== "true" || isDeletingContact}
        >
          {isDeletingContact ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold">YES, DELETE</Text>
          )}
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
