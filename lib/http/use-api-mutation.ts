import {
  useMutation as useRQMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { ApiError } from "./error";

export function useApiMutation<TData, TVariables, TContext = unknown>(
  options: UseMutationOptions<TData, ApiError, TVariables, TContext>
): UseMutationResult<TData, ApiError, TVariables, TContext> {
  return useRQMutation<TData, ApiError, TVariables, TContext>(options);
}
