import { MultiOption } from "~/lib/types";
import { GetContactResponse } from "~/lib/http/response-type/contact";

interface ContactSummary {
  id: number;
  firstName: string;
  lastName: string;
}

export function toFullName(firstName?: string, lastName?: string): string {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

export function summariesToOptions(
  summaries: ContactSummary[] = []
): MultiOption[] {
  return summaries.map((s) => ({
    label: toFullName(s.firstName, s.lastName),
    value: String(s.id),
  }));
}

export function buildNameIndex(
  summaries: ContactSummary[] = []
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of summaries) {
    map[String(s.id)] = toFullName(s.firstName, s.lastName);
  }
  return map;
}

// Build recipients payload for upload API from full details
export interface RecipientDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export function toRecipientDetails(
  contacts: GetContactResponse["contact"][]
): RecipientDetail[] {
  return contacts.map((c) => ({
    id: String(c.id),
    name: toFullName(c.firstName, c.lastName),
    email: c.email,
    phone: c.phone,
  }));
}
