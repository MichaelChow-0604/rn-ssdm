import { API_URL } from "../constants";

export const PUBLIC_PATHS = [
  "/api/v1/users",
  "/api/v1/users/confirmation",
  "/api/v1/users/resend-confirmation",
  "/api/v1/tokens",
];

export const RENEWAL_PATH = "/api/v1/tokens/renewal";

function getPathname(url?: string) {
  if (!url) return "";
  try {
    // axios config.url is usually relative; handle both
    const u = url.startsWith("http") ? new URL(url) : new URL(url, API_URL);
    return u.pathname;
  } catch {
    return url; // fallback
  }
}

function isPathMatch(pathname: string, target: string) {
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function isPublicPath(url?: string) {
  const p = getPathname(url);
  return PUBLIC_PATHS.some((t) => isPathMatch(p, t));
}

export function isRenewalPath(url?: string) {
  const p = getPathname(url);
  return isPathMatch(p, RENEWAL_PATH);
}
