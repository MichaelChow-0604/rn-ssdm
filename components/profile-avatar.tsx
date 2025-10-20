import React from "react";
import { TouchableOpacity, View, Image, Pressable } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import { IconData } from "~/lib/types";

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
    ? { uri: source.uri }
    : require("~/assets/images/default_icon.png");

  return (
    <View className="relative">
      <TouchableOpacity
        className="rounded-full"
        activeOpacity={0.8}
        onPress={isEditable ? onSelectImage : undefined} // Only allow press if editable
        disabled={!isEditable}
      >
        <Image source={imageSource} className="w-24 h-24 rounded-full" />

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
