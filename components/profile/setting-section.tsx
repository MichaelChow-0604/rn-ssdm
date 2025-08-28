import { Href, router } from "expo-router";
import { Text, View } from "react-native";
import { SettingRow } from "./setting-row";

interface SettingsSectionProps {
  title: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    to?: Href | string;
    labelClassName?: string;
    onPress?: () => void;
  }>;
}

export function SettingsSection({ title, items }: SettingsSectionProps) {
  const go = (to?: Href | string) => () => {
    if (!to) return;
    router.push(to as Href);
  };

  return (
    <View className="flex-col gap-2">
      <Text className="text-lg font-bold">{title}</Text>
      <View className="flex-col gap-3">
        {items.map((item) => (
          <SettingRow
            key={item.label}
            icon={item.icon}
            label={item.label}
            onPress={item.onPress ?? go(item.to)}
            labelClassName={item.labelClassName}
          />
        ))}
      </View>
    </View>
  );
}
