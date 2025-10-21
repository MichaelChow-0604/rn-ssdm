import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useMemo } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "~/lib/http/endpoints/document";
import { documentKeys } from "~/lib/http/keys/document";
import { mapSummariesToRows } from "~/components/documents/document-filters";
import { TRASH_COLUMNS } from "./trash-columns";

type DocumentRow = {
  id: string;
  title: string;
  uploadAt: string;
  mimeType: string;
  type: string;
  category: string;
};

export default function TrashListTable() {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: documentKeys.list(),
    queryFn: getDocuments,
  });

  // Pre-filter out documents that are not in the trash status
  const summaries = data?.documentSummaries ?? [];
  const trashSummaries = useMemo(
    () => summaries.filter((s) => s.status === "TRASH"),
    [summaries]
  );

  const tableData = useMemo<DocumentRow[]>(
    () => mapSummariesToRows(trashSummaries),
    [trashSummaries]
  );

  const columns = useMemo<ColumnDef<DocumentRow>[]>(() => {
    return TRASH_COLUMNS();
  }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const coreRowCount = table.getCoreRowModel().rows.length;

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
        {isLoading || isRefetching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color="#438BF7" className="mb-8" />
          </View>
        ) : (
          <FlatList
            data={table.getCoreRowModel().rows}
            keyExtractor={(row) => row.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            ListEmptyComponent={() =>
              coreRowCount === 0 ? <EmptyTrashList /> : null
            }
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
        )}
      </View>
    </View>
  );
}

function EmptyTrashList() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-gray-400 text-2xl font-bold">
        No trash yet
      </Text>
    </View>
  );
}
