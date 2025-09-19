export function validatePasswordLength(password: string) {
  return password.length >= 8;
}
export function validatePasswordUppercase(password: string) {
  return /[A-Z]/.test(password);
}
export function validatePasswordSpecialChar(password: string) {
  return /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
}
