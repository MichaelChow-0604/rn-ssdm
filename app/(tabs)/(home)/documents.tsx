import { View, ScrollView } from "react-native";
import SearchBar from "~/components/search-bar";
import FilterOptions from "~/components/tabs/documents/filter-options";
import DocumentListTable from "~/components/tabs/documents/document-list-table";

export default function Documents() {
  return (
    <View className="flex-1 bg-white">
      {/* Non scrollable session */}
      <View className="items-center justify-evenly h-[140px] px-4">
        <SearchBar />
        <FilterOptions />
      </View>

      {/* Scrollable session */}
      <ScrollView
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        className="flex-1"
      >
        <DocumentListTable />
      </ScrollView>
    </View>
  );
}
