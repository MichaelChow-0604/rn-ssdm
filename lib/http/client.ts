import axios from "axios";
import { API_URL } from "../constants";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Use a clean client for token renewal to avoid interceptor recursion
export const refreshClient = axios.create({
  baseURL: API_URL,
  timeout: 50000,
});
