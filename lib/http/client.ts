import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Use a clean client for token renewal to avoid interceptor recursion
export const refreshClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 50000,
});
