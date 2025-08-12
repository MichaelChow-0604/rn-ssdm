import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";
import { removeDocument } from "~/lib/storage/document";
import { router } from "expo-router";

interface DotDropdownProps {
  documentId: string;
  onDeleted?: () => void;
}

export default function DotDropdown({
  documentId,
  onDeleted,
}: DotDropdownProps) {
  const handleConfirmDelete = async () => {
    await removeDocument(documentId);
    onDeleted?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-full">
        <FontAwesome name="ellipsis-h" size={16} color="black" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="native:w-60 bg-white"
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
          onPress={handleConfirmDelete}
        >
          <Feather name="trash-2" size={20} color="#E42D2D" />
          <Text className="font-medium text-[#E42D2D]">Move to trash</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
