import AsyncStorage from "@react-native-async-storage/async-storage";

export interface StoredContact {
  id: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  profilePicUri?: string | null;
  relationship?: string | null;
  distributions: Array<"email" | "whatsapp" | "sms">;
  createdAt: number;
}

export const CONTACTS_KEY = "@contacts";

function generateId(): string {
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export async function getContacts(): Promise<StoredContact[]> {
  const raw = await AsyncStorage.getItem(CONTACTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredContact[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function addContact(
  input: Omit<StoredContact, "id" | "createdAt">
) {
  const contacts = await getContacts();
  const contact: StoredContact = {
    id: generateId(),
    createdAt: Date.now(),
    ...input,
  };
  contacts.push(contact);
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  return contact;
}

export async function getContact(id: string): Promise<StoredContact | null> {
  const all = await getContacts();
  return all.find((c) => c.id === id) ?? null;
}

export async function updateContact(
  id: string,
  patch: Partial<StoredContact>
): Promise<StoredContact | null> {
  const all = await getContacts();
  let updated: StoredContact | null = null;
  const next = all.map((c) => {
    if (c.id !== id) return c;
    updated = { ...c, ...patch, id: c.id, createdAt: c.createdAt };
    return updated!;
  });
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
  return updated;
}

export async function removeContact(id: string): Promise<void> {
  const all = await getContacts();
  const next = all.filter((c) => c.id !== id);
  await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
}
