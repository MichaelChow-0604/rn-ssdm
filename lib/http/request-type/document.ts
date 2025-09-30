export interface Metadata {
  title: string;
  description: string;
  category: string;
  type: string;
  recipients: string[];
  userDocId: string;
  referenceNo: string;
  remarks: string;
}

export interface FileData {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
}

export interface UploadDocumentPayload {
  file: FileData;
  metadata: Metadata;
}

export interface UpdateDocumentPayload {
  id: string;
  userDocId: string;
  referenceNo: string;
  recipients: string[];
  description: string;
}

export interface UpdateDocumentStatusPayload {
  id: string;
  status: string;
}
