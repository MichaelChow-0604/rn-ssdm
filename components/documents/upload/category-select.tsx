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

const CATEGORIES = [
  { label: "Legal", value: "legal" },
  { label: "Insurance", value: "insurance" },
  { label: "Medical", value: "medical" },
  { label: "Financials", value: "financials" },
];

interface CategorySelectProps {
  selectedCategory: Option;
  setSelectedCategory: (category: Option) => void;
}

export function CategorySelect({
  selectedCategory,
  setSelectedCategory,
}: CategorySelectProps) {
  return (
    <View className="flex-col gap-1">
      <View className="flex-row gap-0.5">
        <Label className="text-black">Category</Label>
        <Text className="text-red-500 font-bold">*</Text>
      </View>
      <Select
        defaultValue={CATEGORIES[0]}
        value={selectedCategory}
        onValueChange={setSelectedCategory}
      >
        <SelectTrigger className="bg-white w-full border-gray-200">
          <SelectValue
            className="text-black font-medium text-lg"
            placeholder="Select Category"
          />
        </SelectTrigger>

        <SelectContent className="w-[80%] bg-white border-gray-200">
          <SelectGroup>
            {CATEGORIES.map((category) => (
              <CategorySelectItem key={category.value} {...category} />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  );
}

interface CategorySelectItemProps {
  label: string;
  value: string;
}

function CategorySelectItem({ label, value }: CategorySelectItemProps) {
  return (
    <SelectItem label={label} value={value} className="active:bg-gray-100" />
  );
}
