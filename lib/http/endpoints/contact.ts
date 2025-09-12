import { api } from "../axios";
import { CreateContactPayload } from "../request-type/contact";
import {
  CreateContactResponse,
  DeleteContactResponse,
  GetContactResponse,
  GetContactsResponse,
} from "../response-type/contact";

export async function createContact(
  payload: CreateContactPayload
): Promise<CreateContactResponse> {
  const { data } = await api.post<CreateContactResponse>(
    "/api/v1/contacts",
    payload
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

export async function deleteContact(
  id: string
): Promise<DeleteContactResponse> {
  const { data } = await api.delete<DeleteContactResponse>(
    `/api/v1/contacts/${id}`
  );
  return data;
}
