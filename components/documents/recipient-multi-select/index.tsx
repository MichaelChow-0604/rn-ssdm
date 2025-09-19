import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IMultiSelectRef, MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { styles } from "~/components/documents/recipient-multi-select/style";
import { MultiOption } from "~/lib/types";

interface RecipientsMultiSelectProps {
  options: MultiOption[];
  value: string[];
  onChange: (vals: string[]) => void;
  maxSelect?: number;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function RecipientsMultiSelect({
  options,
  value,
  onChange,
  maxSelect = 5,
  placeholder = "Select recipients",
  searchPlaceholder = "Search...",
}: RecipientsMultiSelectProps) {
  const multiRef = useRef<IMultiSelectRef>(null!);

  return (
    <MultiSelect
      ref={multiRef}
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={options}
      activeColor="#438BF7"
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      maxSelect={maxSelect}
      search
      searchPlaceholder={searchPlaceholder}
      onChange={(vals: any) => onChange(vals)}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="user" size={20} />
      )}
      renderItem={(item: MultiOption) => (
        <View style={styles.item}>
          <Text style={styles.selectedTextStyle}>{item.label}</Text>
        </View>
      )}
      renderSelectedItem={(item, unSelect) => (
        <TouchableOpacity
          onPress={() => unSelect && unSelect(item)}
          activeOpacity={0.8}
        >
          <View style={styles.selectedStyle}>
            <Text style={styles.textSelectedStyle}>{item.label}</Text>
            <MaterialIcons name="delete-forever" size={20} color="white" />
          </View>
        </TouchableOpacity>
      )}
      renderInputSearch={(onSearch) => (
        <View className="h-auto flex-row items-center p-1 gap-1">
          <Input
            className="flex-1 bg-white border-gray-200 text-black"
            placeholder="Search here"
            onChangeText={onSearch}
            autoCorrect={false}
          />
          <Button
            className="w-[90px] bg-button"
            onPress={() => multiRef.current?.close()}
          >
            <Text className="text-white font-bold">Confirm</Text>
          </Button>
        </View>
      )}
    />
  );
}
