import { Image, Text, TouchableOpacity } from "react-native";

interface ContactRowProps {
  id: string;
  name: string;
  avatarUri?: string;
  onPress: (id: string) => void;
}

export function ContactRow({ id, name, avatarUri, onPress }: ContactRowProps) {
  const iconDataUri = avatarUri
    ? `data:image/jpeg;base64,${avatarUri}`
    : require("~/assets/images/default_icon.png");

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center gap-3 px-6 py-3 border-b border-gray-200"
      onPress={() => onPress(id)}
    >
      {avatarUri ? (
        <Image
          source={{ uri: iconDataUri }}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <Image source={iconDataUri} className="w-10 h-10 rounded-full" />
      )}
      <Text className="text-black font-semibold">{name}</Text>
    </TouchableOpacity>
  );
}
