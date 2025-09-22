export interface UploadDocumentResponse {
  cid: string;
  transactionId: string;
  mimeType: string;
  size: string;
  network: string;
  category: string;
  type: string;
  id: string;
  title: string;
  referenceNo: string;
  recipients: string[];
  description: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}

export interface DocumentSummary {
  id: number;
  cid: string;
  userDocId: string;
  mimeType: string;
  updatedAt: string;
  title: string;
}

export interface GetDocumentsResponse {
  documentSummaries: DocumentSummary[];
  message: string;
  timestamp: string;
}
