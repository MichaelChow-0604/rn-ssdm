import {
  DeleteUserResponse,
  GetProfileResponse,
  UpdateProfileResponse,
} from "../response-type/profile";
import { api } from "../axios";
import {
  DeleteUserPayload,
  UpdateProfilePayload,
} from "../request-type/profile";

export async function getProfile(): Promise<GetProfileResponse> {
  const { data } = await api.get<GetProfileResponse>("/api/v1/users/profile");
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<UpdateProfileResponse> {
  const formData = new FormData();

  if (payload.profilePicture?.uri) {
    formData.append("profilePicture", {
      uri: payload.profilePicture.uri,
      name: payload.profilePicture.name,
      type: payload.profilePicture.mimeType,
    } as any);
  }

  formData.append("profileInfoJson", JSON.stringify(payload.profileInfoJson));

  const { data } = await api.put<UpdateProfileResponse>(
    "/api/v1/users/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function deleteUser(
  payload: DeleteUserPayload
): Promise<DeleteUserResponse> {
  const { data } = await api.delete<DeleteUserResponse>(
    "/api/v1/users/delete",
    { data: payload }
  );
  return data;
}
