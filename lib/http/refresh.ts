import { refreshClient } from "./client";
import { useTokenStore } from "../../store/use-token-store";
import { RENEWAL_PATH } from "./paths";
import { RefreshResponse } from "./response-type/auth";

export async function renewAccessToken(): Promise<string> {
  // Get the current tokens from the store
  const { tokens, setTokens } = useTokenStore.getState();
  const { refreshToken, email } = tokens;

  // If the refresh token or email is missing, throw an error
  if (!refreshToken || !email)
    throw new Error("Missing refresh token or email");

  // Make the request to the renewal endpoint
  console.log("Now try to refresh your token...");
  const res = await refreshClient.post<RefreshResponse>(RENEWAL_PATH, {
    email,
    refreshToken,
  });
  const { accessToken, idToken } = res.data ?? {};
  if (!accessToken) throw new Error("No accessToken in renewal response");

  // Update access token and id token
  setTokens({ ...tokens, accessToken, idToken });

  return accessToken as string;
}
