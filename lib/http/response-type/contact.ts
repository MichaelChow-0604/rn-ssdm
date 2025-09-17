export interface CreateContactResponse {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  communicationOptions: string[];
  created_at: string;
  message: string;
  timestamp: string;
}

interface ContactSummary {
  id: number;
  firstName: string;
  lastName: string;
}

export interface GetContactsResponse {
  contactSummaries: ContactSummary[];
  message: string;
  timestamp: string;
}

interface Contact {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  relationship: string;
  contactOptions: string[];
  created_at: string;
  updated_at: string;
}

export interface GetContactResponse {
  contact: Contact;
  message: string;
  timestamp: string;
}

export interface DeleteContactResponse {
  message: string;
  timestamp: string;
}
