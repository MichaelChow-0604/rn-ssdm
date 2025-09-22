import { api } from "../axios";
import { UploadDocumentPayload } from "../request-type/document";
import {
  GetDocumentsResponse,
  UploadDocumentResponse,
} from "../response-type/document";

export async function uploadDocument(
  payload: UploadDocumentPayload
): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append("file", payload.file as unknown as Blob);
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
