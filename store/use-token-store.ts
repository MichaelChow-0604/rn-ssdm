import { create } from "zustand";

interface TokenStore {
  tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  };

  setTokens: (tokens: {
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
  tokens: {
    idToken: "",
    accessToken: "",
    refreshToken: "",
  },
  setTokens: (tokens) => set({ tokens }),
}));
