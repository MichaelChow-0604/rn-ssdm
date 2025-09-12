import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { Alert, Platform } from "react-native";

interface OpenFileOptions {
  localUri: string;
  mimeType: string; // e.g. "application/pdf"
  iosUTI?: string; // e.g. "com.adobe.pdf"
}

export async function openFile({
  localUri,
  mimeType,
  iosUTI,
}: OpenFileOptions) {
  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) {
      throw new Error(`File does not exist at ${localUri}`);
    }

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert(
        "Sharing unavailable",
        "Sharing is not available on this device. Please try again on a physical device or update iOS."
      );
      return;
    }

    const options =
      Platform.OS === "ios"
        ? { UTI: iosUTI } // iOS only uses UTI
        : { mimeType };

    await Sharing.shareAsync(localUri, options as any);
  } catch (err) {
    console.error("openFile error:", err);
    Alert.alert("Unable to open file", "Please try again.");
  }
}

export function resolveFileMeta(fileName: string): {
  mimeType: string;
  iosUTI?: string;
} {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  switch (ext) {
    case "pdf":
      return { mimeType: "application/pdf", iosUTI: "com.adobe.pdf" };
    case "doc":
      return {
        mimeType: "application/msword",
        iosUTI: "com.microsoft.word.doc",
      };
    case "docx":
      return {
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        iosUTI: "org.openxmlformats.wordprocessingml.document",
      };
    case "jpg":
    case "jpeg":
      return { mimeType: "image/jpeg", iosUTI: "public.jpeg" };
    case "png":
      return { mimeType: "image/png", iosUTI: "public.png" };
    default:
      return { mimeType: "application/octet-stream" };
  }
}

export async function ensureLocalFromAsset(
  moduleId: number,
  fileName: string
): Promise<string> {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const sourceUri = asset.localUri ?? asset.uri;
  const target = FileSystem.cacheDirectory + fileName;
  await FileSystem.copyAsync({ from: sourceUri, to: target });
  return target;
}

export async function ensureLocalFromRemote(
  url: string,
  fileName: string
): Promise<string> {
  const target = FileSystem.cacheDirectory + fileName;
  const { uri } = await FileSystem.downloadAsync(url, target);
  return uri;
}
