export interface SignUpPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password: string;
}

export interface ConfirmSignUpPayload {
  email: string;
  session: string;
  confirmationCode: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface ConfirmSignInPayload {
  email: string;
  session: string;
  confirmationCode: string;
  pushToken: string;
}

export interface ConfirmForgotPasswordPayload {
  email: string;
  session: string;
  confirmationCode: string;
}

export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  password: string;
  confirm_password: string;
}
