import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { toast } from "sonner-native";

export async function pickImage(): Promise<ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Grant Permission to Access Media Library",
      "Please grant permission to access your media library to select an image.",
      [
        {
          text: "Later",
          style: "default",
        },
        {
          text: "Open Settings",
          onPress: async () => await Linking.openSettings(),
        },
      ]
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return null;
  if (
    result.assets?.[0]?.fileSize &&
    result.assets?.[0]?.fileSize > 25 * 1024 * 1024
  ) {
    toast.warning(
      "Image size is too large. Please select an image smaller than 25MB."
    );
    return null;
  }

  return result.assets?.[0] ?? null;
}
