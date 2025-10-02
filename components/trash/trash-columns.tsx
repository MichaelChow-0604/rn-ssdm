import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, Text, View } from "react-native";
import { ColumnDef } from "@tanstack/react-table";
import DotDropdown from "~/components/trash/dot-dropdown";
import { extFromMime, iconForExt, formatIsoToDDMMYYYY } from "~/lib/utils";

export interface DocumentRow {
  id: string;
  title: string;
  uploadAt: string;
  mimeType: string;
  type: string;
  category: string;
}

export function TRASH_COLUMNS(onDeleted: () => void): ColumnDef<DocumentRow>[] {
  return [
    {
      accessorKey: "title",
      header: () => <Text className="font-bold">Document Name</Text>,
      cell: ({ row }) => {
        const doc = row.original;
        return (
          <View className="flex-row items-center gap-2">
            <View className="relative w-8 h-8">
              <FontAwesome
                name="lock"
                size={16}
                color="black"
                className="absolute top-[-6] right-0 z-10"
              />
              <Image
                source={iconForExt(extFromMime(doc.mimeType))}
                className="w-8 h-8"
              />
            </View>
            <Text className="font-semibold">{doc.title}</Text>
          </View>
        );
      },
      meta: { className: "w-[65%] pl-4" },
    },
    {
      accessorKey: "uploadAt",
      header: () => (
        <View className="flex flex-col items-center justify-start">
          <Text className="text-center text-xs text-gray-400">
            (DD/MM/YYYY)
          </Text>
          <Text className="text-center font-bold">Upload Date</Text>
        </View>
      ),
      cell: ({ getValue }) => (
        <Text className="text-center">
          {formatIsoToDDMMYYYY(getValue() as string)}
        </Text>
      ),
      meta: { className: "w-[25%] flex items-center justify-center" },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => (
        <DotDropdown documentId={row.original.id} onDeleted={onDeleted} />
      ),
      meta: { className: "w-[10%] flex items-center justify-center" },
    },
  ];
}
