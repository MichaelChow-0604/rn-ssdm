import { MultiOption } from "~/lib/types";

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
