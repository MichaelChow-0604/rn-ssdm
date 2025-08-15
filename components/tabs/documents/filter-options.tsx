import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState, useCallback } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FilterBottomSheet from "./filter-bottom-sheet";

type FilterOption = "documentType" | "category" | "uploadDate";

export default function FilterOptions() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(
    null
  );
  const [appliedFilter, setAppliedFilter] = useState<FilterOption | null>(null);

  const handlePresentModalPress = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    bottomSheetRef.current?.present();
  }, []);

  const handleClearFilter = useCallback(() => {
    setAppliedFilter(null);
  }, []);

  const markApplied = useCallback((filter: FilterOption) => {
    setAppliedFilter(filter);
  }, []);

  const isApplied = useCallback(
    (filter: FilterOption) => appliedFilter === filter,
    [appliedFilter]
  );

  const handleDismiss = useCallback(() => {
    setSelectedFilter(null);
  }, []);

  return (
    <View className="flex-row items-center justify-between gap-2">
      <FilterBottomSheet
        ref={bottomSheetRef}
        selectedFilter={selectedFilter}
        onDismiss={handleDismiss}
        onApply={(filter) => {
          markApplied(filter);
        }}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => appliedFilter !== null && handleClearFilter()}
      >
        {appliedFilter === null ? (
          <Image
            source={require("~/assets/images/filter_icon.png")}
            style={{ width: 24, height: 24 }}
          />
        ) : (
          <MaterialCommunityIcons name="cancel" size={24} color="black" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`border flex-1 py-2 flex items-center justify-center rounded-lg h-16 ${
          isApplied("documentType")
            ? "border-button border-2"
            : "border-gray-300"
        }`}
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress("documentType")}
      >
        <Text style={styles.label} className="text-center">
          Document Type
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`border flex-1 py-2 flex items-center justify-center rounded-lg h-16 ${
          isApplied("category") ? "border-button border-2" : "border-gray-300"
        }`}
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress("category")}
      >
        <Text style={styles.label}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`border flex-1 py-2 flex items-center justify-center rounded-lg h-16 ${
          isApplied("uploadDate") ? "border-button border-2" : "border-gray-300"
        }`}
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
