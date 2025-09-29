import { View } from "react-native";
import SearchBar from "~/components/search-bar";
import FilterOptions from "~/components/documents/filter-options";
import DocumentListTable from "~/components/documents/document-list-table";
import { useState } from "react";
import { FilterOption } from "~/lib/types";

interface AppliedFilter {
  type: FilterOption | null;
  value: string | null;
}

export default function DocumentTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<AppliedFilter | null>(null);

  return (
    <View className="flex-1 bg-white">
      {/* Search + Filter */}
      <View className="items-center justify-evenly h-[140px] px-4">
        <SearchBar
          placeholder="Search document"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FilterOptions value={filter} onChange={setFilter} />
      </View>

      {/* Document list */}
      <View className="flex-1">
        <DocumentListTable searchQuery={searchQuery} filter={filter} />
      </View>
    </View>
  );
}
