import { View } from "react-native";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  Option,
} from "~/components/ui/select";
import { AntDesign } from "@expo/vector-icons";
import { RELATIONSHIP_OPTIONS } from "~/constants/select-data";

interface RelationshipSelectProps {
  selectedRelationship?: Option;
  setSelectedRelationship: (value?: Option) => void;
  disabled?: boolean;
}

export function RelationshipSelect({
  selectedRelationship,
  setSelectedRelationship,
  disabled,
}: RelationshipSelectProps) {
  return (
    <View className="flex-row gap-4 items-center justify-start">
      <AntDesign name="team" size={24} color="#438BF7" />

      <Select
        value={selectedRelationship}
        onValueChange={setSelectedRelationship}
      >
        <SelectTrigger
          className="bg-white w-[160px] border-gray-200"
          disabled={disabled}
        >
          <SelectValue
            className="text-black font-medium text-lg"
            placeholder="Relationship"
          />
        </SelectTrigger>

        <SelectContent className="w-[160px] bg-white border-gray-200">
          <SelectGroup>
            {RELATIONSHIP_OPTIONS.map((option) => (
              <RelationshipSelectItem
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

interface RelationshipSelectItemProps {
  label: string;
  value: string;
}

function RelationshipSelectItem({ label, value }: RelationshipSelectItemProps) {
  return (
    <SelectItem label={label} value={value} className="active:bg-gray-100">
      {label}
    </SelectItem>
  );
}
