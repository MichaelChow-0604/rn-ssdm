import React from "react";
import { TouchableOpacity, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import { IconData } from "~/lib/types";
import { BLURHASH } from "~/lib/constants";

interface ProfileAvatarProps {
  source?: IconData | null; // Image source (e.g., from profilePic in hooks)
  isEditable?: boolean; // Whether to show edit/remove icons
  onSelectImage?: () => void; // Handler for selecting a new image
  onRemoveImage?: () => void; // Handler for removing the image
  showRemoveIcon?: boolean; // Optionally control remove icon visibility
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  source,
  isEditable = false,
  onSelectImage,
  onRemoveImage,
  showRemoveIcon = true,
}) => {
  const imageSource = source?.uri
    ? source.uri
    : require("~/assets/images/default_icon.png");

  return (
    <View className="relative">
      <TouchableOpacity
        className="rounded-full"
        activeOpacity={0.8}
        onPress={isEditable ? onSelectImage : undefined} // Only allow press if editable
        disabled={!isEditable}
      >
        <View style={styles.container}>
          <Image
            source={imageSource}
            style={styles.image}
            transition={150}
            priority="high"
            cachePolicy="disk"
            recyclingKey={source?.uri}
            placeholder={{ blurhash: BLURHASH }}
            contentFit="cover"
            placeholderContentFit="cover"
          />
        </View>

        {/* Edit icon */}
        {isEditable && (
          <View className="bg-white rounded-full absolute p-1 bottom-0 right-[-2]">
            <FontAwesome6 name="pen" size={12} color="black" />
          </View>
        )}

        {/* Remove icon */}
        {isEditable && source && showRemoveIcon && onRemoveImage && (
          <Pressable
            className="bg-gray-100 opacity-70 rounded-full absolute p-1 top-0 right-[-2]"
            onPress={onRemoveImage}
            hitSlop={10}
          >
            <Entypo name="cross" size={12} color="black" />
          </Pressable>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
});
