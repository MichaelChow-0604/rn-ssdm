import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { BLURHASH } from "~/lib/constants";

interface ContactRowProps {
  id: string;
  name: string;
  profilePictureUrl?: string;
  onPress: (id: string) => void;
}

export function ContactRow({
  id,
  name,
  profilePictureUrl,
  onPress,
}: ContactRowProps) {
  const source = profilePictureUrl
    ? profilePictureUrl
    : require("~/assets/images/default_icon.png");

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center gap-3 px-6 py-3 border-b border-gray-200"
      onPress={() => onPress(id)}
    >
      <Image
        source={source}
        style={styles.image}
        transition={150}
        priority="high"
        cachePolicy="disk"
        recyclingKey={id}
        placeholder={{ blurhash: BLURHASH }}
      />
      <Text className="text-black font-semibold">{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
