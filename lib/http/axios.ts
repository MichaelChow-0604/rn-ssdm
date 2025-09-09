import {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { api } from "./client";
import { isPublicPath, isRenewalPath } from "./paths";
import { renewAccessToken } from "./refresh";
import { useTokenStore } from "../../store/use-token-store";

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

function ensureHeaders(h: AxiosRequestConfig["headers"]): AxiosHeaders {
  return h instanceof AxiosHeaders ? h : AxiosHeaders.from(h as any);
}

// Attach token on protected routes
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

// 401 → refresh once, queue concurrent requests; 403 → no refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("ERRORRRRRRRRRRRRRRRRRR", error);
    const response = error.response;
    const originalRequest = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!response || !originalRequest) return Promise.reject(error);

    const status = response.status;
    const url = originalRequest.url ?? "";

    if (isPublicPath(url) || isRenewalPath(url)) return Promise.reject(error);
    if (status === 403) return Promise.reject(error);

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) return reject(error);
            const headers = ensureHeaders(originalRequest.headers);
            headers.set("Authorization", `Bearer ${newToken}`);
            originalRequest.headers = headers;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await renewAccessToken();
        onTokenRefreshed(newToken);

        const headers = ensureHeaders(originalRequest.headers);
        headers.set("Authorization", `Bearer ${newToken}`);
        originalRequest.headers = headers;
        return api(originalRequest);
      } catch (refreshErr) {
        onTokenRefreshed(null);
        useTokenStore.getState().clearTokens();
        console.log("NOW LOG THE FK OUT");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { api };
