import { View, Text, ScrollView } from "react-native";
import SearchBar from "~/components/search-bar";
import FilterOptions from "~/components/tabs/documents/filter-options";

export default function Documents() {
  return (
    <View className="flex-1 bg-white">
      {/* Non scrollable session */}
      <View className="items-center justify-evenly h-[140px] px-4">
        <SearchBar />
        <FilterOptions />
      </View>

      {/* Scrollable session */}
      <View className="flex-1">
        {/* Titles */}
        <View className="flex-row items-center justify-between px-4 mr-16 py-2">
          <Text className="font-semibold">Document Name</Text>
          <Text className="font-semibold">Update Date</Text>
        </View>

        {/* Document list */}
        <ScrollView className="flex-1">
          {Array.from({ length: 100 }).map((_, index) => (
            <View
              key={index}
              className="h-16 border-b border-gray-300 mx-1 px-3 flex-row items-center justify-between"
            >
              <Text>Document {index + 1}</Text>
              <Text>2312</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
