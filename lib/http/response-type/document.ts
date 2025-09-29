export interface UploadDocumentResponse {
  id: number;
  ssdmDocId: string;
  cid: string;
  mimeType: string;
  size: number;
  network: string;
  category: string;
  type: string;
  userDocId: string;
  title: string;
  fileName: string;
  referenceNo: string;
  recipients: string[];
  description: string;
  remarks: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}

export interface DocumentSummary {
  id: number;
  ssdmDocId: string;
  cid: string;
  title: string;
  userDocId: string;
  type: string;
  category: string;
  size: number;
  mimeType: string;
  polygonCreatedAt: string;
  polygonUpdatedAt: string;
  status: string;
  updatedAt: string;
}

export interface GetDocumentsResponse {
  documentSummaries: DocumentSummary[];
  message: string;
  timestamp: string;
}

export type DocumentStatus = "PROCESSING" | "UPLOADED" | "FAILED" | "";

export interface GetDocumentResponse {
  id: number;
  ssdmDocId: string;
  ownerUserId: string;
  cid: string;
  userDocId: string;
  pinataDocId: string;
  fileName: string;
  referenceNo: string;
  title: string;
  type: string;
  category: string;
  docHash: string;
  size: number;
  mimeType: string;
  network: string;
  description: string;
  remarks: string;
  status: DocumentStatus;
  notificationStatus: string;
  recipients: string[];
  transactionId: string;
  pinataCreatedAt: string;
  pinataUpdatedAt: string;
  polygonCreatedAt: string;
  polygonUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}
