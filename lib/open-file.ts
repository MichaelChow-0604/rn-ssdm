import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
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
    if (!info.exists) throw new Error(`File does not exist at ${localUri}`);

    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert(
        "Sharing unavailable",
        "Sharing is not available on this device. Please try again on a physical device or update iOS."
      );
      return;
    }

    if (Platform.OS === "ios") {
      await Sharing.shareAsync(
        localUri,
        iosUTI ? ({ UTI: iosUTI } as any) : undefined
      );
      return;
    }

    // ANDROID: Prefer a specific MIME; avoid application/octet-stream
    const androidMime =
      mimeType && mimeType !== "application/octet-stream"
        ? mimeType
        : undefined;

    try {
      // Try share sheet first
      await Sharing.shareAsync(
        localUri,
        androidMime ? ({ mimeType: androidMime } as any) : undefined
      );

      return;
    } catch (shareErr) {
      // Fallback: open via VIEW intent using content:// URI
      try {
        const contentUri = await FileSystem.getContentUriAsync(localUri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: androidMime ?? "*/*",
        } as any);

        return;
      } catch (intentErr) {
        console.error("Android intent open error:", intentErr);
        throw shareErr;
      }
    }
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
    case "heic":
      return { mimeType: "image/heic", iosUTI: "public.heic" };
    default:
      return { mimeType: "application/octet-stream" };
  }
}

export async function ensureLocalFromBlob(
  blob: Blob,
  fileName: string
): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read blob"));
    reader.onloadend = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(",");
      if (commaIdx === -1) return reject(new Error("Invalid data URL"));
      resolve(result.slice(commaIdx + 1)); // strip "data:*/*;base64,"
    };
    reader.readAsDataURL(blob);
  });

  const target = FileSystem.cacheDirectory + fileName;
  await FileSystem.writeAsStringAsync(target, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return target;
}
