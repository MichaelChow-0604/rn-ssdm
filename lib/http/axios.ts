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

interface Tokens {
  idToken: string;
  accessToken: string;
}

type Subscriber = (token: Tokens | null) => void;

let isRefreshing = false;
let subscribers: Subscriber[] = [];

function subscribeTokenRefresh(cb: Subscriber) {
  subscribers.push(cb);
}

function onTokenRefreshed(tokens: Tokens | null) {
  subscribers.forEach((cb) => cb(tokens));
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
      if (tokens.idToken && tokens.accessToken) {
        const headers = (config.headers ??= new AxiosHeaders());
        headers.set("Authorization", `Bearer ${tokens.idToken}`);
        headers.set("X-Access-Token", tokens.accessToken);
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
    const response = error.response;
    const originalRequest = error.config as
      | (AxiosRequestConfig & { retried?: boolean })
      | undefined;

    if (!response || !originalRequest) return Promise.reject(error);

    const status = response.status;
    const url = originalRequest.url ?? "";

    // If the request is public or user does not have access permission (403), don't refresh
    if (isPublicPath(url) || isRenewalPath(url)) return Promise.reject(error);
    if (status === 403) return Promise.reject(error);

    // If the request is unauthorized (401) and not retried, refresh the token once
    if (status === 401 && !originalRequest.retried) {
      originalRequest.retried = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newTokens) => {
            if (!newTokens) return reject(error);
            const headers = ensureHeaders(originalRequest.headers);

            // Attach fresh tokens
            headers.set("Authorization", `Bearer ${newTokens.idToken}`);
            headers.set("X-Access-Token", newTokens.accessToken);
            originalRequest.headers = headers;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        // Get the new tokens
        const { idToken, accessToken } = await renewAccessToken();
        // Notify the subscribers that the token has been refreshed
        onTokenRefreshed({ idToken, accessToken });

        const headers = ensureHeaders(originalRequest.headers);

        // Attach the new tokens to the original request
        headers.set("Authorization", `Bearer ${idToken}`);
        headers.set("X-Access-Token", accessToken);

        originalRequest.headers = headers;
        return api(originalRequest);
      } catch (refreshErr) {
        // Refresh failed, meaning the user is not authenticated anymore, log the user out
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
