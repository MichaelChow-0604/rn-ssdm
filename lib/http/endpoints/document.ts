import { api } from "../axios";
import {
  DeleteDocumentPayload,
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

// Download document API
export async function downloadDocument(id: number): Promise<Blob> {
  const { data } = await api.get<Blob>(`/api/v1/documents/72/download`, {
    responseType: "blob",
  });
  return data;
}
