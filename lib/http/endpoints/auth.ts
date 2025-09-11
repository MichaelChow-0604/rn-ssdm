import { api } from "../axios";
import {
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
  SignInPayload,
  SignUpPayload,
} from "../request-type/auth";
import {
  LogoutResponse,
  ResendOTPResponse,
  SignInOTPResponse,
  SignInResponse,
  SignUpOTPResponse,
  SignUpResponse,
} from "../response-type/auth";

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const { data } = await api.post<SignUpResponse>("/api/v1/users", payload);
  return data;
}

export async function confirmSignUp(
  payload: ConfirmSignUpPayload
): Promise<SignUpOTPResponse> {
  const { data } = await api.post<SignUpOTPResponse>(
    "/api/v1/users/confirmation",
    payload
  );
  return data;
}

export async function resendConfirmation(
  email: string
): Promise<ResendOTPResponse> {
  const { data } = await api.post<ResendOTPResponse>(
    "/api/v1/users/resend-confirmation",
    { email }
  );
  return data;
}

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const { data } = await api.post<SignInResponse>("/api/v1/tokens", payload);
  return data;
}

export async function confirmSignIn(
  payload: ConfirmSignInPayload
): Promise<SignInOTPResponse> {
  const { data } = await api.post<SignInOTPResponse>(
    "/api/v1/tokens/confirmation",
    payload
  );
  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const { data } = await api.post<LogoutResponse>("/api/v1/tokens/revocation");
  return data;
}
