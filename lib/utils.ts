import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
      return require("~/assets/docs_icon/image.png");
    default:
      return require("~/assets/docs_icon/unknown.png");
  }
}

export function formatIsoToDDMMYYYY(iso: string) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return "";
  const [, yyyy, mm, dd] = m;
  return `${dd}/${mm}/${yyyy}`;
}

export function formatDateLong(ts: number) {
  const d = new Date(ts);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function beautifyResponse(response: any) {
  return JSON.stringify(response, null, 2);
}
