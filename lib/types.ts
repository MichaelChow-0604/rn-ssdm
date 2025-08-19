export interface Contact {
  id: string;
  name: string;
  avatarUri?: string;
}

export type FilterOption = "documentType" | "category" | "uploadDate";
