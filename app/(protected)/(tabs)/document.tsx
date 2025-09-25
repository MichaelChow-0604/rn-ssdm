import { View } from "react-native";
import SearchBar from "~/components/search-bar";
import FilterOptions from "~/components/documents/filter-options";
import DocumentListTable from "~/components/documents/document-list-table";
import { useState } from "react";

export default function DocumentTab() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex-1 bg-white">
      {/* Search + Filter */}
      <View className="items-center justify-evenly h-[140px] px-4">
        <SearchBar
          placeholder="Search document"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FilterOptions />
      </View>

      {/* Document list */}
      <View className="flex-1">
        <DocumentListTable searchQuery={searchQuery} />
      </View>
    </View>
  );
}
