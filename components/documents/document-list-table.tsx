import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatList, Image, Text, View } from "react-native";
import DotDropdown from "./dot-dropdown";
import { useCallback, useState } from "react";
import { getDocuments, StoredDocument } from "~/lib/storage/document";
import { useFocusEffect } from "expo-router";
import { formateDate, iconForExt } from "~/lib/utils";

export default function DocumentListTable() {
  const [docs, setDocs] = useState<StoredDocument[]>([]);

  // Load documents
  const load = useCallback(async () => {
    const list = await getDocuments();
    setDocs(list);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <Table className="min-w-full flex-1">
      {/* Table header */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[65%] pl-4">
            <Text className="font-bold">Document Name</Text>
          </TableHead>

          <TableHead className="w-[25%] flex flex-col items-center justify-start">
            <Text className="text-center text-xs text-gray-400">
              (DD/MM/YYYY)
            </Text>
            <Text className="text-center font-bold">Upload Date</Text>
          </TableHead>
        </TableRow>
      </TableHeader>

      {/* Table body */}
      <TableBody className="w-full">
        {/* Document list */}
        <FlatList
          data={docs}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          ListEmptyComponent={<EmptyDocumentList />}
          renderItem={({ item: document }) => {
            return (
              <TableRow key={document.id}>
                <TableCell className="w-[65%] flex-row items-center gap-2 pl-4">
                  {/* Document icon and name */}
                  <View className="relative w-8 h-8">
                    <FontAwesome
                      name="lock"
                      size={16}
                      color="black"
                      className="absolute top-[-6] right-0 z-10"
                    />
                    <Image
                      source={iconForExt(document.fileExtension)}
                      className="w-8 h-8"
                    />
                  </View>
                  <Text className="font-semibold">{document.documentName}</Text>
                </TableCell>

                {/* Upload date */}
                <TableCell className="w-[25%] flex items-center justify-center">
                  <Text className="text-center">
                    {formateDate(document.uploadDate)}
                  </Text>
                </TableCell>

                {/* 3-dot menu */}
                <TableCell className="w-[10%] flex items-center justify-center">
                  <DotDropdown documentId={document.id} onDeleted={load} />
                </TableCell>
              </TableRow>
            );
          }}
        />
      </TableBody>
    </Table>
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
