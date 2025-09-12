import { useTokenStore } from "~/store/use-token-store";
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
