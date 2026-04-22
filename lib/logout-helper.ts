// Non hook version of logout helper
import { router } from "expo-router";
import { queryClient } from "./react-query";
import { useTokenStore } from "~/store/use-token-store";
import { toast } from "sonner-native";

export function forceLogout(_reason?: string) {
  queryClient.clear();
  useTokenStore.getState().clearTokens();
  router.replace("/");

  setTimeout(
    () => toast.info("Your session expired. Please sign in again."),
    0
  );
}
