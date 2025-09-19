import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { Platform } from "react-native";

interface OpenFileOptions {
  localUri: string;
  mimeType: string; // e.g. "application/pdf"
  iosUTI?: string; // e.g. "com.adobe.pdf"
}

export async function openFile({ localUri, iosUTI }: OpenFileOptions) {
  // Universal fallback: share sheet
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(
      localUri,
      Platform.OS === "ios" ? { UTI: iosUTI } : undefined
    );
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
  // Optional: copy to a predictable cache path
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
