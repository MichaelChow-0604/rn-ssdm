export interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  relationship: string;
  communicationOption: string[];
}

export interface IconData {
  uri: string;
  name: string;
  mimeType: string;
}

export interface CreateContactPayload {
  profilePicture?: IconData;
  contactInfo: ContactInfo;
}

export interface UpdateContactPayload {
  id: string;
  profilePicture?: IconData;
  contactInfo: ContactInfo;
}
