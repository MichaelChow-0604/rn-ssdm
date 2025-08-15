// lib/storage/trash.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StoredDocument,
  getDocumentById,
  removeDocument as removeFromDocs,
  insertDocument,
} from "./document";

export interface TrashedDocument extends StoredDocument {
  trashedAt: number;
}

const TRASH_KEY = "@trash_documents";

async function getRawTrash(): Promise<string | null> {
  return AsyncStorage.getItem(TRASH_KEY);
}

export async function getTrash(): Promise<TrashedDocument[]> {
  const raw = await getRawTrash();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as TrashedDocument[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function setTrash(list: TrashedDocument[]): Promise<void> {
  await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(list));
}

export async function moveToTrash(id: string): Promise<void> {
  const doc = await getDocumentById(id);
  if (!doc) return;
  await removeFromDocs(id);
  const trashList = await getTrash();
  const trashed: TrashedDocument = { ...doc, trashedAt: Date.now() };
  await setTrash([trashed, ...trashList]);
}

export async function recoverDocument(id: string): Promise<void> {
  const trashList = await getTrash();
  const trashed = trashList.find((t) => t.id === id);
  if (!trashed) return;
  const nextTrash = trashList.filter((t) => t.id !== id);
  await setTrash(nextTrash);
  const { trashedAt, ...rest } = trashed;
  await insertDocument(rest as StoredDocument);
}

export async function removeDocument(id: string): Promise<void> {
  const trashList = await getTrash();
  const next = trashList.filter((t) => t.id !== id);
  await setTrash(next);
}
