import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image, Text, View } from "react-native";
import { ColumnDef } from "@tanstack/react-table";
import DotDropdown from "./dot-dropdown";
import { extFromMime, formatIsoToDDMMYYYY, iconForExt } from "~/lib/utils";
import { DocumentStatus } from "~/lib/http/response-type/document";

export interface DocumentRow {
  id: string;
  title: string;
  uploadAt: string;
  mimeType: string;
  type: string;
  category: string;
  status: DocumentStatus;
}

export const DOCUMENT_COLUMNS: ColumnDef<DocumentRow>[] = [
  {
    accessorKey: "title",
    header: () => <Text className="font-bold">Title</Text>,
    cell: ({ row }) => {
      const doc = row.original;
      return (
        <View className="flex-row items-center gap-2">
          {doc.status === "FAILED" && (
            <FontAwesome name="exclamation-circle" size={16} color="red" />
          )}
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

          <View className="flex-1">
            <Text className="font-semibold">{doc.title}</Text>
          </View>
        </View>
      );
    },
    meta: { className: "w-[65%] pl-4" },
  },
  {
    accessorKey: "uploadAt",
    header: () => (
      <View className="flex flex-col items-center justify-start">
        <Text className="text-center text-xs text-gray-400">(DD/MM/YYYY)</Text>
        <Text className="text-center font-bold">Upload Date</Text>
      </View>
    ),
    // Pending if the uploadAt (polygonUpdatedAt) is not yet available
    cell: ({ getValue }) => {
      const iso = getValue() as string | undefined;
      const text = iso ? formatIsoToDDMMYYYY(iso) : "Pending";
      return <Text className="text-center">{text}</Text>;
    },
    meta: { className: "w-[25%] flex items-center justify-center" },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <DotDropdown documentId={row.original.id} status={row.original.status} />
    ),
    meta: { className: "w-[10%] flex items-center justify-center" },
  },
];
