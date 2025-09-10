import { api } from "../axios";
import {
  ResendOTPResponse,
  SignInOTPResponse,
  SignUpOTPResponse,
} from "../response-type/auth";

export interface ConfirmSignInPayload {
  email: string;
  session: string;
  confirmationCode: string;
}

export interface ConfirmSignUpPayload {
  email: string;
  confirmationCode: string;
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

export async function confirmSignIn(
  payload: ConfirmSignInPayload
): Promise<SignInOTPResponse> {
  const { data } = await api.post<SignInOTPResponse>(
    "/api/v1/tokens/confirmation",
    payload
  );
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
