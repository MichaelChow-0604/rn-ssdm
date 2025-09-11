export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ConfirmSignUpPayload {
  email: string;
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
}
