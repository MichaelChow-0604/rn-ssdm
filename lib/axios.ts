import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { API_URL } from "./constants";
import { useTokenStore } from "../store/use-token-store";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Use a clean client for token renewal to avoid interceptor recursion
const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Public endpoints: never attach token, never try to refresh
const PUBLIC_PATHS = [
  "/api/v1/users",
  "/api/v1/users/confirmation",
  "/api/v1/users/resend-confirmation",
  "/api/v1/tokens",
];
// Renewal endpoint: special-cased to never re-enter refresh flow
const RENEWAL_PATH = "/api/v1/tokens/renewal";

function isPublicPath(url?: string) {
  if (!url) return false;
  return PUBLIC_PATHS.some((p) => url.includes(p));
}
function isRenewalPath(url?: string) {
  return !!url && url.includes(RENEWAL_PATH);
}

// Refresh coordination
type Subscriber = (token: string | null) => void;

let isRefreshing = false;
let subscribers: Subscriber[] = [];

function subscribeTokenRefresh(cb: Subscriber) {
  subscribers.push(cb);
}
function onTokenRefreshed(token: string | null) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

async function renewAccessToken(): Promise<string> {
  const { tokens, setAccessToken, setTokens } = useTokenStore.getState();
  const { refreshToken, email } = tokens;

  if (!refreshToken || !email) {
    throw new Error("Missing refresh token or email");
  }

  const res = await refreshClient.post(RENEWAL_PATH, {
    email,
    refreshToken,
  });

  // Expected response (example): { email, accessToken, expiresIn, idToken, tokenType }
  const { accessToken, idToken } = res.data ?? {};
  if (!accessToken) {
    throw new Error("No accessToken in renewal response");
  }

  // Update tokens in store (preserve existing refreshToken/email)
  if (idToken) {
    setTokens({ ...tokens, accessToken, idToken });
  } else {
    setAccessToken(accessToken);
  }

  return accessToken as string;
}

// Request: attach Authorization header for protected routes
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (!isPublicPath(config.url) && !isRenewalPath(config.url)) {
      const { tokens } = useTokenStore.getState();
      if (tokens.accessToken) {
        (config.headers ??= new AxiosHeaders()).set(
          "Authorization",
          `Bearer ${tokens.accessToken}`
        );
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: handle 401 → refresh, 403 → do not refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const response = error.response;
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // If there's no HTTP response (network/timeout), bubble up
    if (!response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = response.status;
    const url = originalRequest.url ?? "";

    // Never refresh for public routes or the renewal endpoint itself
    if (isPublicPath(url) || isRenewalPath(url)) {
      return Promise.reject(error);
    }

    // 403 → user is authenticated but forbidden; do not refresh
    if (status === 403) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until the current refresh resolves
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };
            resolve(api(originalRequest));
          });
        });
      }

      // Start a new refresh
      isRefreshing = true;
      try {
        const newToken = await renewAccessToken();
        onTokenRefreshed(newToken);
        // Replay the original request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api(originalRequest);
      } catch (refreshErr) {
        // Notify queued requests of failure
        onTokenRefreshed(null);
        // Optional: you may clear tokens here and let the UI redirect
        // useTokenStore.getState().clearTokens();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
