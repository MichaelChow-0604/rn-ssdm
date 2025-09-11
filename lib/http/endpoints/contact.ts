import { api } from "../axios";
import { CreateContactPayload } from "../request-type/contact";
import {
  CreateContactResponse,
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
