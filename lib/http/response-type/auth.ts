export interface SignUpResponse {
  id: number;
  userSub: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpOTPResponse {
  email: string;
  session: string;
}

export interface ResendOTPResponse {
  email: string;
}

export interface SignInResponse {
  email: string;
  challengeName: string;
  session: string;
}

export interface SignInOTPResponse {
  email: string;
  accessToken: string;
  expiresIn: number;
  idToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RefreshResponse {
  email: string;
  accessToken: string;
  expiresIn: number;
  idToken: string;
  tokenType: string;
}

export interface LogoutResponse {
  message: string;
  timestamp: string;
}
