import {
  ChangePasswordPayload,
  ConfirmForgotPasswordPayload,
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
  ResendConfirmationPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
} from "../request-type/auth";
import {
  ChangePasswordResponse,
  ForgotPasswordOTPResponse,
  ForgotPasswordResponse,
  LogoutResponse,
  ResendOTPResponse,
  ResetPasswordResponse,
  SignInOTPResponse,
  SignInResponse,
  SignUpOTPResponse,
  SignUpResponse,
} from "../response-type/auth";
import { api } from "../client";

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
  payload: ResendConfirmationPayload
): Promise<ResendOTPResponse> {
  const { data } = await api.post<ResendOTPResponse>(
    "/api/v1/users/resend-confirmation",
    payload
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

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>(
    "/api/v1/users/forgot-password",
    { email }
  );
  return data;
}

export async function confirmForgotPassword(
  payload: ConfirmForgotPasswordPayload
): Promise<ForgotPasswordOTPResponse> {
  const { data } = await api.post<ForgotPasswordOTPResponse>(
    "/api/v1/users/forgot-password-confirmation",
    payload
  );
  return data;
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  const { data } = await api.post<ResetPasswordResponse>(
    "/api/v1/users/reset-password",
    payload
  );
  return data;
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  const { data } = await api.post<ChangePasswordResponse>(
    "/api/v1/users/change-password",
    payload
  );
  return data;
}
