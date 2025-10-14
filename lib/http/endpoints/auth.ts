import {
  ChangePasswordPayload,
  ConfirmForgotPasswordPayload,
  ConfirmSignInPayload,
  ConfirmSignUpPayload,
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
import { request } from "../request";

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return request<SignUpResponse>({
    method: "post",
    url: "/api/v1/users",
    data: payload,
  });
}

export async function confirmSignUp(
  payload: ConfirmSignUpPayload
): Promise<SignUpOTPResponse> {
  return request<SignUpOTPResponse>({
    method: "post",
    url: "/api/v1/users/confirmation",
    data: payload,
  });
}

export async function resendConfirmation(
  email: string
): Promise<ResendOTPResponse> {
  return request<ResendOTPResponse>({
    method: "post",
    url: "/api/v1/users/resend-confirmation",
    data: { email },
  });
}

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  return request<SignInResponse>({
    method: "post",
    url: "/api/v1/tokens",
    data: payload,
  });
}

export async function confirmSignIn(
  payload: ConfirmSignInPayload
): Promise<SignInOTPResponse> {
  return request<SignInOTPResponse>({
    method: "post",
    url: "/api/v1/tokens/confirmation",
    data: payload,
  });
}

export async function logout(): Promise<LogoutResponse> {
  return request<LogoutResponse>({
    method: "post",
    url: "/api/v1/tokens/revocation",
  });
}

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  return request<ForgotPasswordResponse>({
    method: "post",
    url: "/api/v1/users/forgot-password",
    data: { email },
  });
}

export async function confirmForgotPassword(
  payload: ConfirmForgotPasswordPayload
): Promise<ForgotPasswordOTPResponse> {
  return request<ForgotPasswordOTPResponse>({
    method: "post",
    url: "/api/v1/users/forgot-password-confirmation",
    data: payload,
  });
}

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> {
  return request<ResetPasswordResponse>({
    method: "post",
    url: "/api/v1/users/reset-password",
    data: payload,
  });
}

export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
  return request<ChangePasswordResponse>({
    method: "post",
    url: "/api/v1/users/change-password",
    data: payload,
  });
}
