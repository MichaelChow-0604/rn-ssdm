import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { PermanentDeleteAlert } from "../pop-up/permanent-delete-alert";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { UpdateDocumentStatusPayload } from "~/lib/http/request-type/document";
import { UpdateDocumentStatusResponse } from "~/lib/http/response-type/document";
import { updateDocumentStatus } from "~/lib/http/endpoints/document";
import { toast } from "sonner-native";
import { documentKeys } from "~/lib/http/keys/document";

interface DotDropdownProps {
  documentId: string;
}

export default function DotDropdown({ documentId }: DotDropdownProps) {
  const queryClient = useQueryClient();
  const [isPermanentDeleteAlertOpen, setIsPermanentDeleteAlertOpen] =
    useState(false);

  const recoverMutation = useApiMutation<
    UpdateDocumentStatusResponse,
    UpdateDocumentStatusPayload
  >({
    mutationKey: ["document", "updateStatus"],
    mutationFn: updateDocumentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
      toast.success("Document recovered successfully.", {
        position: "bottom-center",
      });
    },
    onError: (err) =>
      toast.error("Failed to recover document. Please try again later."),
  });

  const onConfirmRecover = () => {
    recoverMutation.mutate({ id: documentId, status: "UPLOADED" });
  };

  const handlePermanentDelete = async () => {
    router.replace({
      pathname: "/(protected)/(trash)/delete-doc-confirm",
      params: { documentId },
    });

    setIsPermanentDeleteAlertOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full">
          <FontAwesome name="ellipsis-h" size={16} color="black" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="native:w-60 bg-white border-gray-200"
          insets={{ right: 8 }}
        >
          <DropdownMenuItem
            className="flex-row items-center gap-2 active:bg-gray-100"
            onPress={onConfirmRecover}
          >
            <Ionicons name="reload" size={20} color="black" />
            <Text className="font-medium">Recover</Text>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex-row items-center gap-2 active:bg-gray-100"
            onPress={() => setIsPermanentDeleteAlertOpen(true)}
          >
            <Feather name="trash-2" size={20} color="#E42D2D" />
            <Text className="font-medium text-[#E42D2D]">
              Permanently delete
            </Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pop up alert */}
      <PermanentDeleteAlert
        visible={isPermanentDeleteAlertOpen}
        onConfirm={handlePermanentDelete}
        onCancel={() => setIsPermanentDeleteAlertOpen(false)}
      />
    </>
  );
}
