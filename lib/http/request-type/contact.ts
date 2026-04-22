import { IconData } from "~/lib/types";

export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  communicationOption: string[];
}

export interface CreateContactPayload {
  profilePicture?: IconData | null;
  contactInfo: ContactInfo;
}

export interface UpdateContactPayload {
  id: string;
  profilePicture?: IconData | null;
  contactInfo: ContactInfo;
}
