import { View, Text } from "react-native";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Option,
} from "~/components/ui/select";

interface SelectDropdownProps {
  label: string;
  options: ReadonlyArray<NonNullable<Option>>;
  selectedOption: Option;
  setSelectedOption: (option: Option) => void;
}

export function SelectDropdown({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: SelectDropdownProps) {
  return (
    <View className="flex-col gap-1">
      {/* Label */}
      <View className="flex-row gap-0.5">
        <Label className="text-black">{label}</Label>
        <Text className="text-red-500 font-bold">*</Text>
      </View>

      <Select
        defaultValue={options[0]}
        value={selectedOption}
        onValueChange={setSelectedOption}
      >
        <SelectTrigger className="bg-white w-full border-gray-200">
          <SelectValue
            className="text-black font-medium text-lg"
            placeholder="Select Option"
          />
        </SelectTrigger>

        <SelectContent className="w-[80%] bg-white border-gray-200">
          <SelectGroup>
            {options.map((option) => (
              <SelectDropdownItem
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}

interface SelectDropdownItemProps {
  label: string;
  value: string;
}

function SelectDropdownItem({ label, value }: SelectDropdownItemProps) {
  return (
    <SelectItem label={label} value={value} className="active:bg-gray-100" />
  );
}
