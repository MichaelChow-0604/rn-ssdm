import { AxiosRequestConfig } from "axios";
import { api } from "./axios";
import { toApiError } from "./error";

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const { data } = await api.request<T>(config);
    return data;
  } catch (e) {
    throw toApiError(e);
  }
}
