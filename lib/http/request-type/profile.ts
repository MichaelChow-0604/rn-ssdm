import { IconData } from "~/lib/types";

interface ProfileInfoJson {
  firstName: string;
  lastName: string;
}

export interface UpdateProfilePayload {
  profilePicture?: IconData | null;
  profileInfoJson: ProfileInfoJson;
}

export interface DeleteUserPayload {
  email: string;
  password: string;
}
