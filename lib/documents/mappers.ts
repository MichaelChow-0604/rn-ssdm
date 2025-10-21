import type { GetDocumentResponse } from "~/lib/http/response-type/document";
import { getUploadMeta } from "./utils";

export interface DocumentVM {
  category: string;
  type: string;
  title: string;
  userDocId: string;
  referenceNumber: string;
  description: string;
  remarks: string;
  fileName: string;
  transactionId: string;
  status: GetDocumentResponse["status"];
  updatedAt: string;
  recipients: string[];
  uploadDate: string;
  uploadTime: string;
}

export function toDocumentVM(r?: GetDocumentResponse): DocumentVM {
  const status = r?.status ?? "FAILED";
  const updatedAt = r?.updatedAt ?? "";
  const { uploadDate, uploadTime } = getUploadMeta(status, updatedAt);

  return {
    category: r?.category ?? "",
    type: r?.type ?? "",
    title: r?.title ?? "",
    userDocId: r?.userDocId ?? "",
    referenceNumber: r?.referenceNo ?? "",
    description: r?.description ?? "",
    remarks: r?.remarks ?? "",
    fileName: r?.fileName ?? "",
    transactionId: r?.transactionId ?? "",
    status,
    updatedAt,
    recipients: (r?.recipients ?? []).map(String),
    uploadDate,
    uploadTime,
  };
}
