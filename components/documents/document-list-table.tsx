import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, Image, Text, View, Platform } from "react-native";
import DotDropdown from "./dot-dropdown";
import { formateDate, iconForExt } from "~/lib/utils";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

type DocumentRow = {
  id: string;
  documentName: string;
  uploadDate: number; // epoch seconds
  fileExtension: string;
};

const TEMP_DATA: DocumentRow[] = [
  {
    id: "1",
    documentName: "Rikki",
    uploadDate: 1726684800,
    fileExtension: "pdf",
  },
  {
    id: "2",
    documentName: "Document 2",
    uploadDate: 1726684800,
    fileExtension: "jpeg",
  },
  {
    id: "3",
    documentName: "Document 3",
    uploadDate: 1726684800,
    fileExtension: "docx",
  },
];

const COLUMNS: ColumnDef<DocumentRow>[] = [
  {
    accessorKey: "documentName",
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
            <Image source={iconForExt(doc.fileExtension)} className="w-8 h-8" />
          </View>
          <Text className="font-semibold">{doc.documentName}</Text>
        </View>
      );
    },
    meta: { className: "w-[65%] pl-4" },
  },
  {
    accessorKey: "uploadDate",
    header: () => (
      <View className="flex flex-col items-center justify-start">
        <Text className="text-center text-xs text-gray-400">(DD/MM/YYYY)</Text>
        <Text className="text-center font-bold">Upload Date</Text>
      </View>
    ),
    cell: ({ getValue }) => (
      <Text className="text-center">{formateDate(getValue() as number)}</Text>
    ),
    meta: { className: "w-[25%] flex items-center justify-center" },
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <DotDropdown documentId={row.original.id} />,
    meta: { className: "w-[10%] flex items-center justify-center" },
  },
];

export default function DocumentListTable() {
  const table = useReactTable({
    data: TEMP_DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <View className="min-w-full flex-1">
      {/* Header */}
      <View className="border-border">
        {table.getHeaderGroups().map((headerGroup) => (
          <View
            key={headerGroup.id}
            className="flex-row border-gray-200 border-b mx-1"
          >
            {headerGroup.headers.map((header) => (
              <View
                key={header.id}
                className={`h-12 justify-center ${
                  (
                    header.column.columnDef.meta as
                      | { className?: string }
                      | undefined
                  )?.className ?? ""
                }`}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Body */}
      <View className="w-full flex-1">
        <FlatList
          data={rows}
          keyExtractor={(row) => row.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={<EmptyDocumentList />}
          renderItem={({ item: row }) => (
            <View className="flex-row border-gray-200 border-b mx-1">
              {row.getVisibleCells().map((cell) => (
                <View
                  key={cell.id}
                  className={`py-4 ${
                    (
                      cell.column.columnDef.meta as
                        | { className?: string }
                        | undefined
                    )?.className ?? ""
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </View>
              ))}
            </View>
          )}
        />
      </View>
    </View>
  );
}

function EmptyDocumentList() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text
        className={`text-center text-gray-400 text-2xl font-bold ${
          Platform.OS === "ios" ? "mb-24" : ""
        }`}
      >
        No document yet
      </Text>
    </View>
  );
}
