export interface SignUpResponse {
  userSub: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  status: string;
  session: string;
  createdAt: string;
  updatedAt: string;
  message: string;
  timestamp: string;
}

export interface SignUpOTPResponse {
  email: string;
  message: string;
  timestamp: string;
}

export interface ResendOTPResponse {
  email: string;
  session: string;
  message: string;
  timestamp: string;
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
