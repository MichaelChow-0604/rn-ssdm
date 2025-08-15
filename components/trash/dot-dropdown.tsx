import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";
import { recoverDocument } from "~/lib/storage/trash";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { PermanentDeleteAlert } from "../pop-up/permanent-delete-alert";
import { router } from "expo-router";

interface DotDropdownProps {
  documentId: string;
  onDeleted?: () => void;
}

export default function DotDropdown({
  documentId,
  onDeleted,
}: DotDropdownProps) {
  const [isPermanentDeleteAlertOpen, setIsPermanentDeleteAlertOpen] =
    useState(false);

  const handleRecover = async () => {
    await recoverDocument(documentId);
    onDeleted?.();
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
          className="native:w-60 bg-white"
          insets={{ right: 8 }}
        >
          <DropdownMenuItem
            className="flex-row items-center gap-2 active:bg-gray-100"
            onPress={handleRecover}
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
      <PermanentDeleteAlert
        visible={isPermanentDeleteAlertOpen}
        onConfirm={handlePermanentDelete}
        onCancel={() => setIsPermanentDeleteAlertOpen(false)}
      />
    </>
  );
}
