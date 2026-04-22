import { createContext, useContext, ReactNode } from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface SettingsContextValue {
  notificationEnabled: boolean;
  isHydrated: boolean;
  setNotificationEnabled: (
    next: boolean | ((prev: boolean | undefined) => boolean)
  ) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const {
    value: notificationEnabled,
    isLoading,
    set,
  } = useLocalStorage<boolean>("notification-rule", true);

  return (
    <SettingsContext.Provider
      value={{
        notificationEnabled: notificationEnabled ?? true,
        isHydrated: !isLoading,
        setNotificationEnabled: set,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
