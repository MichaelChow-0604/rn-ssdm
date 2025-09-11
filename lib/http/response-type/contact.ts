export interface CreateContactResponse {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  communicationOptions: string[];
  createdAt: string;
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
