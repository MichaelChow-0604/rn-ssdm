import { FilterOption } from "~/lib/types";
import type { DocumentRow } from "./document-columns";
import { DocumentStatus } from "~/lib/http/response-type/document";

export interface AppliedFilter {
  type: FilterOption | null;
  value: string | null;
}

interface DocumentSummaryLike {
  id: string | number;
  title: string;
  polygonUpdatedAt: string;
  mimeType: string;
  type?: string;
  category?: string;
  status: DocumentStatus;
}

export function mapSummariesToRows(
  summaries: DocumentSummaryLike[]
): DocumentRow[] {
  return summaries.map((s) => ({
    id: String(s.id),
    title: s.title,
    uploadAt: s.polygonUpdatedAt,
    mimeType: s.mimeType,
    type: String(s.type ?? ""),
    category: String(s.category ?? ""),
    status: s.status,
  }));
}

function norm(s: string) {
  return String(s).trim().toLowerCase();
}

export function applyFilterAndSort(
  rows: DocumentRow[],
  filter: AppliedFilter | null
): DocumentRow[] {
  let out = rows;

  if (filter?.type === "documentType" && filter.value) {
    out = out.filter((r) => norm(r.type) === norm(filter.value!));
  } else if (filter?.type === "category" && filter.value) {
    out = out.filter((r) => norm(r.category) === norm(filter.value!));
  }

  if (filter?.type === "uploadDate" && filter.value) {
    const desc = norm(filter.value) === "latest";
    out = [...out].sort((a, b) => {
      const da = new Date(a.uploadAt).getTime();
      const db = new Date(b.uploadAt).getTime();
      return desc ? db - da : da - db;
    });
  }

  return out;
}
