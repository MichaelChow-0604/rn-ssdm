export interface GetProfileResponse {
  id: number;
  userSub: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  message: string;
  timestamp: string;
}

export interface UpdateProfileResponse {
  firstName: string;
  lastName: string;
  profilePictureKey: string;
}
