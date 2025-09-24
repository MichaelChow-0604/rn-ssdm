import { DocumentStatus } from "../http/response-type/document";
import { formatIsoToDDMMYYYY, formatIsoToHKTTime } from "../utils";

export function getRecipientNames(
  ids: string[],
  nameIndex: Record<string, string>
): string {
  if (!ids?.length) return "";
  return ids
    .map((id) => nameIndex[id])
    .filter(Boolean)
    .join(", ");
}

export function getUploadMeta(status: DocumentStatus, updatedAt: string) {
  if (status === "UPLOADED") {
    return {
      uploadDate: formatIsoToDDMMYYYY(updatedAt),
      uploadTime: formatIsoToHKTTime(updatedAt),
    };
  }

  if (status === "PROCESSING") {
    return {
      uploadDate: "Pending",
      uploadTime: "Pending",
    };
  }

  return {
    uploadDate: "Please reupload",
    uploadTime: "Please reupload",
  };
}
