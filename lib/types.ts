export interface Contact {
  id: string;
  name: string;
  avatarUri?: string;
}

export type FilterOption = "documentType" | "category" | "uploadDate";

export interface MultiOption {
  label: string;
  value: string; // contact id
}

export interface IconData {
  uri: string;
  name: string;
  mimeType: string;
}
