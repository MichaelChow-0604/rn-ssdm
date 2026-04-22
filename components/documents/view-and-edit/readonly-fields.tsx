import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface ReadOnlyInputProps {
  value: string;
}

export function ReadOnlyInput({ value }: ReadOnlyInputProps) {
  return (
    <Input
      className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
      value={value}
      editable={false}
    />
  );
}

interface ReadOnlyTextareaProps {
  value: string;
}

export function ReadOnlyTextarea({ value }: ReadOnlyTextareaProps) {
  return (
    <Textarea
      className="text-subtitle font-medium bg-gray-300 opacity-80 border-0"
      value={value}
      editable={false}
    />
  );
}
