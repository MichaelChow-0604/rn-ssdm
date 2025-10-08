import { IconData } from "~/lib/types";

interface ProfileInfoJson {
  firstName: string;
  lastName: string;
}

export interface UpdateProfilePayload {
  profilePicture?: IconData;
  profileInfoJson: ProfileInfoJson;
}
