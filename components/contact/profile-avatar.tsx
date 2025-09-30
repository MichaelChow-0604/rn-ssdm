import { Image, TouchableOpacity, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export interface ProfileAvatarProps {
  imageUri: string | null;
  editable: boolean;
  onPress?: () => void;
}

export function ProfileAvatar({
  imageUri,
  editable,
  onPress,
}: ProfileAvatarProps) {
  const source = imageUri
    ? { uri: imageUri }
    : require("~/assets/images/default_icon.png");

  return (
    <View className="w-24 h-24 relative">
      <TouchableOpacity
        className="rounded-full"
        activeOpacity={editable ? 0.8 : 1}
        onPress={onPress}
      >
        <Image source={source} className="w-24 h-24 rounded-full" />
        {editable && (
          <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
            <FontAwesome6 name="pen" size={12} color="black" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
