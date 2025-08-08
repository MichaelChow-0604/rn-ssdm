import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FilterBottomSheet from "./filter-bottom-sheet";

type FilterOption = "documentType" | "category" | "uploadDate";

export default function FilterOptions() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(
    null
  );

  const handlePresentModalPress = (filter: FilterOption) => {
    setSelectedFilter(filter);
    bottomSheetRef.current?.present();
  };

  return (
    <View className="flex-row items-center justify-between gap-2">
      <FilterBottomSheet
        ref={bottomSheetRef}
        selectedFilter={selectedFilter}
        onDismiss={() => setSelectedFilter(null)}
      />
      <TouchableOpacity activeOpacity={0.7}>
        <Image
          source={require("~/assets/images/filter_icon.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress("documentType")}
      >
        <Text style={styles.label}>Document Type</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress("category")}
      >
        <Text style={styles.label}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border flex-1 py-2 flex items-center justify-center rounded-lg border-gray-300"
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress("uploadDate")}
      >
        <Text style={styles.label}>Upload Date</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#6f6f6f",
  },
});
