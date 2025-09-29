import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef, useState, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FilterBottomSheet from "./filter-bottom-sheet";
import { FilterOption } from "~/lib/types";

interface FilterButtonProps {
  type: FilterOption;
  label: string;
}

interface AppliedFilter {
  type: FilterOption | null;
  value: string | null;
}

export default function FilterOptions({
  value,
  onChange,
}: {
  value: AppliedFilter | null;
  onChange: (next: AppliedFilter | null) => void;
}) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(
    null
  );

  const handlePresentModalPress = useCallback((filter: FilterOption) => {
    setSelectedFilter(filter);
    bottomSheetRef.current?.present();
  }, []);

  const handleClearFilter = useCallback(() => {
    onChange(null);
  }, [onChange]);

  const isApplied = useCallback(
    (filter: FilterOption) => value?.type === filter,
    [value?.type]
  );

  const handleDismiss = useCallback(() => {
    setSelectedFilter(null);
  }, []);

  // Filter button component
  function FilterButton({ type, label }: FilterButtonProps) {
    return (
      <TouchableOpacity
        className={`border flex-1 py-2 flex items-center justify-center rounded-lg h-16 ${
          isApplied(type) ? "border-button border-2" : "border-gray-300"
        }`}
        activeOpacity={0.7}
        onPress={() => handlePresentModalPress(type)}
      >
        <Text style={styles.label} className="text-center px-2">
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-row items-center justify-between gap-2">
      {/* Filter bottom sheet */}
      <FilterBottomSheet
        ref={bottomSheetRef}
        selectedFilter={selectedFilter}
        onDismiss={handleDismiss}
        onApply={(filter, subId) => {
          onChange({ type: filter, value: subId });
        }}
      />

      {/* Clear filter button */}
      <TouchableOpacity
        activeOpacity={0.7}
        // If filter is applied, clear it
        onPress={handleClearFilter}
      >
        {value === null ? (
          // No filter applied
          <MaterialCommunityIcons
            name="filter-outline"
            size={24}
            color="black"
          />
        ) : (
          // Filter applied
          <MaterialCommunityIcons name="filter" size={24} color="#438BF7" />
        )}
      </TouchableOpacity>

      {/* Document type filter button */}
      <FilterButton type="documentType" label="Document Type" />

      {/* Category filter button */}
      <FilterButton type="category" label="Category" />

      {/* Upload date filter button */}
      <FilterButton type="uploadDate" label="Upload Date" />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#6f6f6f",
  },
});
