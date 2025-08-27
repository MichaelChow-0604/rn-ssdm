import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";
import { moveToTrash } from "~/lib/storage/trash";
import { router } from "expo-router";
import { useState } from "react";
import { MoveToTrashAlert } from "~/components/pop-up/move-to-trash-alert";

interface DotDropdownProps {
  documentId: string;
  onDeleted?: () => void;
}

export default function DotDropdown({
  documentId,
  onDeleted,
}: DotDropdownProps) {
  const [isMoveToTrashAlertOpen, setIsMoveToTrashAlertOpen] = useState(false);

  const handleMoveToTrash = async () => {
    await moveToTrash(documentId);
    onDeleted?.();
    setIsMoveToTrashAlertOpen(false);
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
            onPress={() =>
              router.push({
                pathname: "/edit-document",
                params: { documentId },
              })
            }
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

      <MoveToTrashAlert
        visible={isMoveToTrashAlertOpen}
        onConfirm={handleMoveToTrash}
        onCancel={() => setIsMoveToTrashAlertOpen(false)}
      />
    </>
  );
}
