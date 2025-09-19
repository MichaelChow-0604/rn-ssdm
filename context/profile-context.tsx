import { createContext, useContext, useState, ReactNode } from "react";

export interface ProfileData {
  profilePic: string | null;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileContextValue {
  profile: ProfileData;
  updateProfile: (patch: Partial<ProfileData>) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    profilePic: null,
    firstName: "Tommy",
    lastName: "Chan",
    email: "tommy.chan@example.com",
  });

  function updateProfile(patch: Partial<ProfileData>) {
    setProfile((p) => ({ ...p, ...patch }));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
