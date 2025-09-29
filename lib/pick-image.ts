import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";

export async function pickImage(): Promise<ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) return null;
  return result.assets?.[0] ?? null;
}
