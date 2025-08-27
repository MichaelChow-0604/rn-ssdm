import { View } from "react-native";
import SearchBar from "~/components/search-bar";
import FilterOptions from "~/components/documents/filter-options";
import DocumentListTable from "~/components/documents/document-list-table";

export default function DocumentTab() {
  return (
    <View className="flex-1 bg-white">
      {/* Search + Filter */}
      <View className="items-center justify-evenly h-[140px] px-4">
        <SearchBar placeholder="Search document" />
        <FilterOptions />
      </View>

      {/* Document list */}
      <View className="flex-1">
        <DocumentListTable />
      </View>
    </View>
  );
}
