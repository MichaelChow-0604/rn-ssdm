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

export function formatDateLong(ts: number) {
  const d = new Date(ts);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
