import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconData } from "./types";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { File } from "expo-file-system";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// E.g. 1724630400000 -> 26/08/2024
export function formateDate(ts: number) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function extFromMime(mime: string | undefined): string {
  if (!mime) return "unknown";
  const m = mime.toLowerCase();

  if (m === "application/pdf") return "pdf";
  if (m === "application/msword") return "doc";
  if (
    m ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return "docx";
  if (m === "image/jpeg" || m === "image/jpg") return "jpg";
  if (m === "image/png") return "png";
  if (m === "image/heic") return "heic";

  const parts = m.split("/");
  return parts[1] || "unknown";
}

export function iconForExt(ext: string) {
  switch (ext?.toLowerCase()) {
    case "pdf":
      return require("~/assets/docs_icon/pdf.png");
    case "doc":
    case "docx":
      return require("~/assets/docs_icon/doc.png");
    case "jpg":
    case "jpeg":
    case "png":
    case "heic":
      return require("~/assets/docs_icon/image.png");
    default:
      return require("~/assets/docs_icon/doc.png");
  }
}

export function formatIsoToDDMMYYYY(iso: string) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return "";
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

export function formatIsoToHKTTime(iso: string): string {
  if (!iso) return "";
  const m =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+\-]\d{2}:\d{2})?$/.exec(
      iso
    );
  if (!m) return "";
  const [, , , , HH, MM, , tz] = m;

  // If timezone is present, convert to HKT (UTC+8); else assume already HKT
  if (tz) {
    const dt = new Date(iso); // absolute moment
    const hktMs = dt.getTime() + 8 * 60 * 60 * 1000;
    const d = new Date(hktMs);
    const h24 = d.getUTCHours();
    const minutes = d.getUTCMinutes();
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${ampm} HKT`;
  }

  // No timezone ⇒ treat as HKT already
  const h24 = Number(HH);
  const minutes = Number(MM);
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${ampm} HKT`;
}

export function beautifyResponse(response: any) {
  return JSON.stringify(response, null, 2);
}

// test purpose
export function delayApi(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function compressToJpeg(input: IconData): Promise<IconData> {
  // Only compress when original file size is greater than 2MB
  try {
    const file = new File(input.uri);
    const info = file.info();
    const TWO_MB = 2 * 1024 * 1024;

    if (info.exists && typeof info.size === "number" && info.size <= TWO_MB)
      return input;
  } catch {
    return input;
  }

  const ctx = ImageManipulator.manipulate(input.uri).resize({
    width: 128,
    height: 128,
  });
  const image = await ctx.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.5,
  });

  return {
    uri: result.uri,
    name: input.name,
    mimeType: "image/jpeg",
  };
}
