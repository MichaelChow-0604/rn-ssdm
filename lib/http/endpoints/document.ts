import { api } from "../axios";
import { UploadDocumentPayload } from "../request-type/document";
import {
  GetDocumentResponse,
  GetDocumentsResponse,
  UploadDocumentResponse,
} from "../response-type/document";

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

export async function getDocuments(): Promise<GetDocumentsResponse> {
  const { data } = await api.get<GetDocumentsResponse>("/api/v1/documents");
  return data;
}

export async function getDocumentById(
  id: string
): Promise<GetDocumentResponse> {
  const { data } = await api.get<GetDocumentResponse>(
    `/api/v1/documents/${id}`
  );
  return data;
}

export async function downloadDocument(id: number): Promise<Blob> {
  const { data } = await api.get<Blob>(`/api/v1/documents/72/download`, {
    responseType: "blob",
  });

  return data;
}
