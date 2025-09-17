export interface Metadata {
  title: string;
  description: string;
  category: string;
  type: string;
  recipients: string[];
  id: string;
  referenceNo: string;
  remarks: string;
}

export interface FileData {
  uri: string;
  name: string;
  type: string;
}

export interface UploadDocumentPayload {
  file: FileData;
  metadata: Metadata;
}
