import React, {
  forwardRef,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Button } from "~/components/ui/button";

type FilterOption = "documentType" | "category" | "uploadDate" | null;
interface FilterBottomSheetProps {
  selectedFilter: FilterOption;
  onDismiss: () => void;
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

// Reusable grid component (controlled)
interface FilterGridProps {
  items: Array<{ id: string; label: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function FilterGrid({ items, selectedId, onSelect }: FilterGridProps) {
  return (
    <View className="flex-row flex-wrap gap-4 items-center justify-center w-full p-4">
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          className={`w-[45%] flex items-center justify-center p-2 rounded-lg ${
            selectedId === item.id ? "bg-button" : "bg-gray-100 "
          }`}
          activeOpacity={1}
          onPress={() => {
            onSelect(item.id);
          }}
        >
          <Text
            className={`text-gray-700 font-medium ${
              selectedId === item.id ? "text-white" : ""
            }`}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetProps>(
  ({ selectedFilter, onDismiss }, ref) => {
    const [selectedSubOption, setSelectedSubOption] = useState<string | null>(
      null
    );

    const { dismiss } = useBottomSheetModal();

    // Reset sub-option when main filter changes
    useEffect(() => {
      setSelectedSubOption(null);
    }, [selectedFilter]);

    const handleDismiss = useCallback(() => {
      setSelectedSubOption(null);
      onDismiss?.(); // notify parent to clear selectedFilter
    }, [onDismiss]);

    const selectedFilterType =
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
      return (
        <FilterGrid
          items={items}
          selectedId={selectedSubOption}
          onSelect={setSelectedSubOption}
        />
      );
    }

    const handleApply = () => {
      dismiss();
      console.log("Apply filter:", {
        option: selectedFilter,
        subOption: selectedSubOption,
      });
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        onDismiss={handleDismiss}
      >
        <BottomSheetView className="flex-1 items-center justify-start pt-4 pb-12">
          {/* Filtered by */}
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl font-semibold">Filtered by</Text>
            <Text className="text-2xl text-button font-bold">
              {selectedFilterType}
            </Text>
          </View>

          <View className="items-center justify-center py-6">
            {renderFilterContent()}
          </View>

          <Button
            className="w-1/3 bg-button"
            onPress={handleApply}
            disabled={!selectedFilter || !selectedSubOption}
          >
            <Text className="text-white font-bold">Apply</Text>
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default FilterBottomSheet;
