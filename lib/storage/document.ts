import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StoredDocument {
  id: string;
  documentName: string;
  description?: string;
  category: string;
  type: string;
  fileName: string;
  fileExtension: string;
  recipients: string[]; // contact ids
  uploadDate: number; // timestamp
  uploadTime: string; // "HH:MM AM/PM HKT"
  transactionId: string; // 64 hex chars
}

const DOCUMENTS_KEY = "@documents";

function generateId(): string {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function formatHKTTime(date: Date): string {
  const utcHours = date.getUTCHours();
  const hktHours24 = (utcHours + 8) % 24;
  const minutes = date.getUTCMinutes();
  const ampm = hktHours24 >= 12 ? "PM" : "AM";
  const h12 = hktHours24 % 12 === 0 ? 12 : hktHours24 % 12;
  return `${String(h12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )} ${ampm} HKT`;
}

function generateTransactionId(length = 64): string {
  const characters = "abcdef0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function getDocuments(): Promise<StoredDocument[]> {
  const raw = await AsyncStorage.getItem(DOCUMENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredDocument[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function addDocument(
  input: Omit<
    StoredDocument,
    "id" | "uploadDate" | "uploadTime" | "transactionId"
  >
): Promise<StoredDocument> {
  const all = await getDocuments();
  const now = new Date();
  const doc: StoredDocument = {
    id: generateId(),
    uploadDate: now.getTime(),
    uploadTime: formatHKTTime(now),
    transactionId: generateTransactionId(64),
    ...input,
  };
  await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify([doc, ...all]));
  return doc;
}

export async function getDocumentById(
  id: string
): Promise<StoredDocument | null> {
  const all = await getDocuments();
  return all.find((d) => d.id === id) ?? null;
}

export async function updateDocument(
  id: string,
  patch: Partial<StoredDocument>
): Promise<StoredDocument | null> {
  const all = await getDocuments();
  let updated: StoredDocument | null = null;
  const next = all.map((d) => {
    if (d.id !== id) return d;
    updated = { ...d, ...patch, id: d.id, uploadDate: d.uploadDate };
    return updated!;
  });
  await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(next));
  return updated;
}

export async function insertDocument(doc: StoredDocument): Promise<void> {
  const all = await getDocuments();
  await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify([doc, ...all]));
}

export async function removeDocument(id: string): Promise<void> {
  const all = await getDocuments();
  const next = all.filter((d) => d.id !== id);
  await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(next));
}
