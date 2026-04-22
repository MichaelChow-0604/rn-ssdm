import { useMemo } from "react";
import {
  validatePasswordLength,
  validatePasswordSpecialChar,
  validatePasswordUppercase,
} from "~/lib/password-validation";

export interface PasswordValidationResults {
  length: boolean;
  uppercase: boolean;
  specialChar: boolean;
}

export function usePasswordValidation(
  password: string | undefined
): PasswordValidationResults {
  return useMemo(() => {
    if (!password) {
      return {
        length: false,
        uppercase: false,
        specialChar: false,
      };
    }
    return {
      length: validatePasswordLength(password),
      uppercase: validatePasswordUppercase(password),
      specialChar: validatePasswordSpecialChar(password),
    };
  }, [password]);
}
