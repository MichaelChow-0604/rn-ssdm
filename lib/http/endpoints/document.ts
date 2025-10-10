import { api } from "../axios";
import {
  DeleteDocumentPayload,
  DownloadDocumentPayload,
  UpdateDocumentPayload,
  UpdateDocumentStatusPayload,
  UploadDocumentPayload,
} from "../request-type/document";
import {
  DeleteDocumentResponse,
  GetDocumentResponse,
  GetDocumentsResponse,
  UpdateDocumentResponse,
  UpdateDocumentStatusResponse,
  UploadDocumentResponse,
} from "../response-type/document";

// Upload document API
export async function uploadDocument(
  payload: UploadDocumentPayload
): Promise<UploadDocumentResponse> {
  const formData = new FormData();

  // RN FormData file shape
  formData.append("file", {
    uri: payload.file.uri,
    name: payload.file.name,
    type: payload.file.mimeType ?? "application/octet-stream",
  } as any);

  formData.append("metadata", JSON.stringify(payload.metadata));

  const { data } = await api.post<UploadDocumentResponse>(
    "/api/v1/documents",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

// Edit document API
export async function updateDocument(
  payload: UpdateDocumentPayload
): Promise<UpdateDocumentResponse> {
  const { data } = await api.put<UpdateDocumentResponse>(
    `/api/v1/documents/${payload.id}`,
    payload
  );
  return data;
}

// Move to trash / Recover document API
export async function updateDocumentStatus(
  payload: UpdateDocumentStatusPayload
): Promise<UpdateDocumentStatusResponse> {
  const { id, status } = payload;
  const { data } = await api.put<UpdateDocumentStatusResponse>(
    `/api/v1/documents/${id}/status`,
    undefined,
    { params: { status } }
  );
  return data;
}

// Get all documents API
export async function getDocuments(): Promise<GetDocumentsResponse> {
  const { data } = await api.get<GetDocumentsResponse>("/api/v1/documents");
  return data;
}

// Get document by ID API
export async function getDocumentById(
  id: string
): Promise<GetDocumentResponse> {
  const { data } = await api.get<GetDocumentResponse>(
    `/api/v1/documents/${id}`
  );
  return data;
}

// Delete document API
export async function deleteDocument(
  payload: DeleteDocumentPayload
): Promise<DeleteDocumentResponse> {
  const config = payload.password
    ? { data: { password: payload.password } }
    : { data: {} };

  const { data } = await api.delete<DeleteDocumentResponse>(
    `/api/v1/documents/${payload.id}`,
    config
  );
  return data;
}

// Interface for downloaded blob
export interface DownloadedBlob {
  fileName: string;
  blob: Blob;
  contentType?: string;
}

// Helper function to get filename from content disposition
function filenameFromContentDisposition(
  value: string | undefined
): string | null {
  if (!value) return null;
  // Handles: filename="name.ext" and RFC5987: filename*=UTF-8''name.ext
  const rfc5987 = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(value);
  if (rfc5987?.[1])
    return decodeURIComponent(rfc5987[1].replace(/(^")|("$)/g, ""));
  const simple = /filename="?([^";]+)"?/i.exec(value);
  if (simple?.[1]) return simple[1];
  return null;
}

// Download document API
export async function downloadDocument(
  payload: DownloadDocumentPayload
): Promise<DownloadedBlob> {
  const res = await api.post<Blob>(`/api/v1/documents/download`, payload, {
    responseType: "blob",
  });

  const headers = res.headers as Record<string, string | undefined>;
  const disposition =
    headers["content-disposition"] ?? headers["Content-Disposition"];
  const contentType = headers["content-type"] ?? headers["Content-Type"];

  let fileName = filenameFromContentDisposition(disposition) ?? "document";
  return { fileName, blob: res.data, contentType };
}
