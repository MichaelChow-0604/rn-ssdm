import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { beautifyResponse } from "~/lib/utils";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "~/lib/http/endpoints/document";
import { documentKeys } from "~/lib/http/keys/document";
import { useMemo } from "react";
import { FilterOption } from "~/lib/types";
import { DOCUMENT_COLUMNS } from "./document-columns";
import { applyFilterAndSort, mapSummariesToRows } from "./document-filters";

type DocumentRow = {
  id: string;
  title: string;
  uploadAt: string;
  mimeType: string;
  type: string;
  category: string;
};

interface AppliedFilter {
  type: FilterOption | null;
  value: string | null;
}

interface DocumentListTableProps {
  searchQuery: string;
  filter?: AppliedFilter | null;
}

const globalFilterFn: FilterFn<DocumentRow> = (row, columnId, filterValue) => {
  const title = row.original.title.toLowerCase();
  const search = String(filterValue).toLowerCase();

  return title.includes(search);
};

interface DocumentListTableProps {
  searchQuery: string;
}

export default function DocumentListTable({
  searchQuery = "",
  filter = null,
}: DocumentListTableProps) {
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: documentKeys.list(),
    queryFn: getDocuments,
  });

  console.log(beautifyResponse(data));

  const summaries = data?.documentSummaries ?? [];
  const baseData = useMemo<DocumentRow[]>(
    () => mapSummariesToRows(summaries),
    [summaries]
  );

  const tableData = useMemo<DocumentRow[]>(() => {
    return applyFilterAndSort(baseData, filter);
  }, [baseData, filter]);

  const columns = useMemo<ColumnDef<DocumentRow>[]>(() => DOCUMENT_COLUMNS, []);

  const table = useReactTable({
    data: tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: globalFilterFn,
    state: {
      globalFilter: searchQuery,
    },
  });

  const coreRowCount = table.getCoreRowModel().rows.length;
  const filteredRowCount = table.getFilteredRowModel().rows.length;

  console.log(
    `Row count: Original=${coreRowCount}, Filtered=${filteredRowCount}`
  );

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
            data={table.getFilteredRowModel().rows}
            keyExtractor={(row) => row.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            ListEmptyComponent={() =>
              coreRowCount === 0 ? (
                <EmptyDocumentList />
              ) : searchQuery.length > 0 ? (
                <NoSearchResults />
              ) : null
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

function EmptyDocumentList() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-gray-400 text-2xl font-bold">
        No document yet
      </Text>
    </View>
  );
}

function NoSearchResults() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-center text-gray-400 text-2xl font-bold">
        No results found
      </Text>
    </View>
  );
}
