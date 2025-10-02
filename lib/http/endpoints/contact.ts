import { api } from "../axios";
import {
  CreateContactPayload,
  UpdateContactPayload,
} from "../request-type/contact";
import {
  CheckRelatedDocsResponse,
  CreateContactResponse,
  DeleteContactResponse,
  GetContactResponse,
  GetContactsResponse,
  UpdateContactResponse,
} from "../response-type/contact";

export async function createContact(
  payload: CreateContactPayload
): Promise<CreateContactResponse> {
  const formData = new FormData();

  // RN FormData file shape, only append if profilePicture is provided
  if (payload.profilePicture?.uri) {
    formData.append("profilePicture", {
      uri: payload.profilePicture.uri,
      name: payload.profilePicture.name,
      type: payload.profilePicture.mimeType,
    } as any);
  }

  formData.append("contactInfo", JSON.stringify(payload.contactInfo));

  const { data } = await api.post<CreateContactResponse>(
    "/api/v1/contacts",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function updateContact(
  payload: UpdateContactPayload
): Promise<UpdateContactResponse> {
  const formData = new FormData();

  // RN FormData file shape, only append if profilePicture is provided
  if (payload.profilePicture?.uri) {
    formData.append("profilePicture", {
      uri: payload.profilePicture.uri,
      name: payload.profilePicture.name,
      type: payload.profilePicture.mimeType,
    } as any);
  }

  formData.append("contactInfo", JSON.stringify(payload.contactInfo));

  const { data } = await api.put<UpdateContactResponse>(
    `/api/v1/contacts/${payload.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
}

export async function getContacts(): Promise<GetContactsResponse> {
  const { data } = await api.get<GetContactsResponse>("/api/v1/contacts");
  return data;
}

export async function getContactById(id: string): Promise<GetContactResponse> {
  const { data } = await api.get<GetContactResponse>(`/api/v1/contacts/${id}`);
  return data;
}

export async function checkRelatedDocs(
  id: string
): Promise<CheckRelatedDocsResponse> {
  const { data } = await api.get<CheckRelatedDocsResponse>(
    `/api/v1/contacts/${id}/accessible-documents`
  );
  return data;
}

export async function deleteContact(
  id: number
): Promise<DeleteContactResponse> {
  const { data } = await api.delete<DeleteContactResponse>(
    `/api/v1/contacts/${id}`
  );
  return data;
}
