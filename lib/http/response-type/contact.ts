// Create Contact API Response
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

// Get all Contacts API Response
interface ContactSummary {
  id: number;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

export interface GetContactsResponse {
  contactSummaries: ContactSummary[];
  message: string;
  timestamp: string;
}

// Get Contact by ID API Response
export interface GetContactResponse {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  relationship: string;
  contactOptions: string[];
  profilePictureUrl?: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}

// Check Related Documents API Response
export interface RelatedDoc {
  id: number;
  title: string;
}

export interface CheckRelatedDocsResponse {
  accessedOnlyByContact: RelatedDoc[];
  accessedByContact: RelatedDoc[];
  message: string;
  timestamp: string;
}

// Delete Contact API Response
export interface DeleteContactResponse {
  message: string;
  timestamp: string;
}

export interface UpdateContactResponse {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  communicationOptions: string[];
  updatedAt: string;
  message: string;
  timestamp: string;
}
