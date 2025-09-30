import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { MoveToTrashAlert } from "~/components/pop-up/move-to-trash-alert";
import { useQueryClient } from "@tanstack/react-query";
import { documentKeys } from "~/lib/http/keys/document";
import {
  getDocumentById,
  updateDocumentStatus,
} from "~/lib/http/endpoints/document";
import { useApiMutation } from "~/lib/http/use-api-mutation";
import { UpdateDocumentStatusResponse } from "~/lib/http/response-type/document";
import { UpdateDocumentStatusPayload } from "~/lib/http/request-type/document";
import { toast } from "sonner-native";

interface DotDropdownProps {
  documentId: string;
}

export default function DotDropdown({ documentId }: DotDropdownProps) {
  const queryClient = useQueryClient();
  const [isMoveToTrashAlertOpen, setIsMoveToTrashAlertOpen] = useState(false);

  const moveToTrashMutation = useApiMutation<
    UpdateDocumentStatusResponse,
    UpdateDocumentStatusPayload
  >({
    mutationKey: ["document", "updateStatus"],
    mutationFn: updateDocumentStatus,
    onSuccess: () => {
      setIsMoveToTrashAlertOpen(false);
      toast.success("Document moved to trash successfully.");
      queryClient.invalidateQueries({ queryKey: documentKeys.list() });
    },
    onError: (err) => {
      console.log(err.response);
      toast.error("Failed to move document to trash. Please try again later.");
    },
  });

  const onConfirmMoveToTrash = () => {
    moveToTrashMutation.mutate({ id: documentId, status: "TRASH" });
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
            onPress={() => {
              queryClient.prefetchQuery({
                queryKey: documentKeys.detail(documentId),
                queryFn: () => getDocumentById(documentId),
              });

              router.push({
                pathname: "/edit-document",
                params: { documentId },
              });
            }}
          >
            <Feather name="edit" size={20} color="black" />
            <Text className="font-medium">View & edit details</Text>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex-row items-center gap-2 active:bg-gray-100"
            onPress={() => setIsMoveToTrashAlertOpen(true)}
          >
            <Feather name="trash-2" size={20} color="#E42D2D" />
            <Text className="font-medium text-[#E42D2D]">Move to trash</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Pop up alert */}
      <MoveToTrashAlert
        visible={isMoveToTrashAlertOpen}
        onConfirm={onConfirmMoveToTrash}
        onCancel={() => setIsMoveToTrashAlertOpen(false)}
      />
    </>
  );
}
