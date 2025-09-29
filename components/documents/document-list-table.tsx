import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import DotDropdown from "./dot-dropdown";
import {
  beautifyResponse,
  extFromMime,
  formatIsoToDDMMYYYY,
  iconForExt,
} from "~/lib/utils";

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
    () =>
      summaries.map((s) => ({
        id: String(s.id),
        title: s.title,
        uploadAt: s.polygonUpdatedAt,
        mimeType: s.mimeType,
        type: String(s.type ?? ""),
        category: String(s.category ?? ""),
      })),
    [summaries]
  );

  function norm(s: string) {
    return String(s).trim().toLowerCase();
  }

  const tableData = useMemo<DocumentRow[]>(() => {
    let rows = baseData;

    if (filter?.type === "documentType" && filter.value) {
      rows = rows.filter((r) => norm(r.type) === norm(filter.value!));
    } else if (filter?.type === "category" && filter.value) {
      rows = rows.filter((r) => norm(r.category) === norm(filter.value!));
    }

    if (filter?.type === "uploadDate" && filter.value) {
      const desc = norm(filter.value) === "latest";
      rows = [...rows].sort((a, b) => {
        const da = new Date(a.uploadAt).getTime();
        const db = new Date(b.uploadAt).getTime();
        return desc ? db - da : da - db;
      });
    }

    return rows;
  }, [baseData, filter]);

  const columns = useMemo<ColumnDef<DocumentRow>[]>(() => COLUMNS, []);

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

const COLUMNS: ColumnDef<DocumentRow>[] = [
  {
    accessorKey: "title",
    header: () => <Text className="font-bold">Title</Text>,
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
        <Text className="text-center text-xs text-gray-400">(DD/MM/YYYY)</Text>
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
    cell: ({ row }) => <DotDropdown documentId={row.original.id} />,
    meta: { className: "w-[10%] flex items-center justify-center" },
  },
];
