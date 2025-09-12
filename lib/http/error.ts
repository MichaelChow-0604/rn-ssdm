import { AxiosError } from "axios";
import { z } from "zod";

const ErrorBody = z.object({
  message: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.string().optional(),
});

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  url?: string;
  raw?: unknown;
}

export function toApiError(err: unknown): ApiError {
  const isAx =
    typeof err === "object" && err !== null && (err as any).isAxiosError;
  if (isAx) {
    const ax = err as AxiosError;
    const status = ax.response?.status ?? 0;
    const url = ax.config?.url;
    const parsed = ErrorBody.safeParse(ax.response?.data);
    const message =
      parsed.success && parsed.data.message ? parsed.data.message : ax.message;
    const code = parsed.success ? parsed.data.code : undefined;
    return { status, message, code, url, raw: ax.response?.data };
  }
  return {
    status: 0,
    message: err instanceof Error ? err.message : "Unknown error",
  };
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === "object" && e !== null && "status" in e;
}
