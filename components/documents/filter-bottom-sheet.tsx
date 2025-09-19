import React, {
  forwardRef,
  useCallback,
  useState,
  useEffect,
  memo,
  useMemo,
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
import { FilterOption } from "~/lib/types";
import { FILTER_DATA } from "~/constants/filter-data";

interface FilterBottomSheetProps {
  selectedFilter: FilterOption | null;
  onDismiss: () => void;
  onApply: (filter: Exclude<FilterOption, null>, subOptionId: string) => void;
}

// Reusable grid component (controlled)
interface FilterGridProps {
  items: Array<{ id: string; label: string }>;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const FilterGridItem = memo(function FilterGridItem({
  item,
  selected,
  onPress,
}: {
  item: { id: string; label: string };
  selected: boolean;
  onPress: (id: string) => void;
}) {
  const handlePress = useCallback(() => onPress(item.id), [onPress, item.id]);
  return (
    <TouchableOpacity
      className={`w-[45%] flex items-center justify-center p-2 rounded-lg ${
        selected ? "bg-button" : "bg-gray-100 "
      }`}
      activeOpacity={1}
      onPress={handlePress}
    >
      <Text
        className={`text-gray-700 font-medium ${selected ? "text-white" : ""}`}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
});

const FilterGrid = memo(function FilterGrid({
  items,
  selectedId,
  onSelect,
}: FilterGridProps) {
  return (
    <View className="flex-row flex-wrap gap-4 items-center justify-center w-full p-4">
      {items.map((item) => (
        <FilterGridItem
          key={item.id}
          item={item}
          selected={selectedId === item.id}
          onPress={onSelect}
        />
      ))}
    </View>
  );
});

const FilterBottomSheet = forwardRef<BottomSheetModal, FilterBottomSheetProps>(
  ({ selectedFilter, onDismiss, onApply }, ref) => {
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

    const selectedFilterType = useMemo(
      () =>
        selectedFilter === "documentType"
          ? "Document Type"
          : selectedFilter === "category"
          ? "Category"
          : selectedFilter === "uploadDate"
          ? "Upload Date"
          : null,
      [selectedFilter]
    );

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

    const items = useMemo(
      () => (selectedFilter ? FILTER_DATA[selectedFilter] : []),
      [selectedFilter]
    );

    const handleApply = useCallback(() => {
      if (selectedFilter && selectedSubOption) {
        onApply(selectedFilter, selectedSubOption);
      }
      dismiss();
      console.log("Apply filter:", {
        option: selectedFilter,
        subOption: selectedSubOption,
      });
    }, [dismiss, onApply, selectedFilter, selectedSubOption]);

    return (
      <BottomSheetModal
        ref={ref}
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
            {selectedFilter ? (
              <FilterGrid
                items={items}
                selectedId={selectedSubOption}
                onSelect={setSelectedSubOption}
              />
            ) : null}
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
