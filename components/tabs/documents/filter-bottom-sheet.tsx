import React, { forwardRef, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Button } from "~/components/ui/button";

type FilterOption = "documentType" | "category" | "uploadDate" | null;

interface FilterBottomSheetProps {
  selectedFilter: FilterOption;
}

// Define your filter data
const filterData = {
  documentType: [
    { id: "insurance_policy", label: "Insurance Policy" },
    { id: "will", label: "Will" },
  ],
  category: [
    { id: "legal", label: "Legal" },
    { id: "insurance", label: "Insurance" },
    { id: "medical", label: "Medical" },
    { id: "financials", label: "Financials" },
  ],
  uploadDate: [
    { id: "latest", label: "Latest" },
    { id: "earliest", label: "Earliest" },
  ],
};

// Reusable grid component
interface FilterGridProps {
  items: Array<{ id: string; label: string }>;
}

function FilterGrid({ items }: FilterGridProps) {
  return (
    <View className="flex-row flex-wrap gap-4 items-center justify-center w-full p-4">
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="w-[45%] flex items-center justify-center bg-gray-100 p-2 rounded-lg"
          activeOpacity={0.7}
          onPress={() => {
            console.log(`Selected: ${item.id}`);
            // Handle selection here
          }}
        >
          <Text className="text-gray-700 font-medium">{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetProps>(
  ({ selectedFilter }, ref) => {
    const selected =
      selectedFilter === "documentType"
        ? "Document Type"
        : selectedFilter === "category"
        ? "Category"
        : selectedFilter === "uploadDate"
        ? "Upload Date"
        : null;
    const snapPoints = useMemo(() => ["35%"], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          enableTouchThrough={true}
          {...props}
        />
      ),
      []
    );

    function renderFilterContent() {
      if (!selectedFilter) return null;

      const items = filterData[selectedFilter];
      return <FilterGrid items={items} />;
    }

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
      >
        <View className="flex-1 items-center justify-start pt-4">
          {/* Filtered by */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl font-semibold">Filtered by</Text>
            <Text className="text-2xl text-button font-bold">{selected}</Text>
          </View>

          <View className="items-center justify-center py-6">
            {renderFilterContent()}
          </View>

          <Button className="w-1/3 bg-button">
            <Text className="text-white font-bold">Apply</Text>
          </Button>
        </View>
      </BottomSheetModal>
    );
  }
);

export default FilterBottomSheet;
