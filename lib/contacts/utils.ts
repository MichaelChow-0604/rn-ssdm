import { StoredContact } from "../storage/contact";
import { Contact } from "../types";

// derive display name
export function fullName(c: StoredContact) {
  return `${c.firstName} ${c.lastName}`.trim();
}

// helpers
export function normalizeName(name: string) {
  return name
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function groupKeyFromName(name: string) {
  const n = normalizeName(name);
  const first = n[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(first) ? first : "#"; // non-letters go to '#'
}

export function buildSections(contacts: Contact[]) {
  const map = new Map<string, Contact[]>();

  for (const c of contacts) {
    const key = groupKeyFromName(c.name);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }

  // only non-empty, sorted section keys
  const keys = Array.from(map.keys()).sort();

  return keys.map((title) => ({
    title,
    data: map
      .get(title)!
      .sort((a, b) =>
        normalizeName(a.name).localeCompare(normalizeName(b.name))
      ),
  }));
}

export function toListItem(c: StoredContact): Contact {
  return {
    id: c.id,
    name: fullName(c),
    avatarUri: c.profilePicUri ?? undefined,
  };
}
