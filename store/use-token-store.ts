import { create } from "zustand";

interface Tokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  email?: string; // needed by /tokens/renewal
}

interface TokenStore {
  tokens: Tokens;
  setTokens: (tokens: Tokens) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  tokens: {
    idToken: "",
    accessToken: "",
    refreshToken: "",
    email: undefined,
  },
  setTokens: (tokens) => set({ tokens }),
  setAccessToken: (accessToken) =>
    set({ tokens: { ...get().tokens, accessToken } }),
  clearTokens: () =>
    set({
      tokens: {
        idToken: "",
        accessToken: "",
        refreshToken: "",
        email: undefined,
      },
    }),
}));
