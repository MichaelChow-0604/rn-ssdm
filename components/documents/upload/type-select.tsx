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

const TYPES = [
  { label: "Will", value: "will" },
  { label: "Insurance Policy", value: "insurance-policy" },
];

interface TypeSelectProps {
  selectedType: Option;
  setSelectedType: (type: Option) => void;
}

export function TypeSelect({ selectedType, setSelectedType }: TypeSelectProps) {
  return (
    <View className="flex-col gap-1">
      <View className="flex-row gap-0.5">
        <Label className="text-black">Type</Label>
        <Text className="text-red-500 font-bold">*</Text>
      </View>
      <Select
        defaultValue={{ label: "Will", value: "will" }}
        value={selectedType}
        onValueChange={setSelectedType}
      >
        <SelectTrigger className="bg-white w-full border-gray-200">
          <SelectValue
            className="text-black font-medium text-lg"
            placeholder="Select Type"
          />
        </SelectTrigger>
        <SelectContent className="w-[80%] bg-white border-gray-200">
          <SelectGroup>
            {TYPES.map((type) => (
              <TypeSelectItem key={type.value} {...type} />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}

interface TypeSelectItemProps {
  label: string;
  value: string;
}

function TypeSelectItem({ label, value }: TypeSelectItemProps) {
  return (
    <SelectItem label={label} value={value} className="active:bg-gray-100" />
  );
}
