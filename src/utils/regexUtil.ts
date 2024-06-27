export function isValidEmail(emailAddress: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(emailAddress);
}

export function validatePasswordStrength(password: string): {
  isStrong: boolean;
  message: string;
} {
  const minLength: number = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()\-_=+{};:,<.>]/.test(password);

  const isStrong: boolean =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasDigit &&
    hasSpecialChar;

  let errorMessage = "";

  if (password.length < minLength) {
    errorMessage += "Password must be at least 8 characters long. ";
  }
  if (!hasUpperCase) {
    errorMessage += "Password must contain at least one uppercase letter. ";
  }
  if (!hasLowerCase) {
    errorMessage += "Password must contain at least one lowercase letter. ";
  }
  if (!hasDigit) {
    errorMessage += "Password must contain at least one digit. ";
  }
  if (!hasSpecialChar) {
    errorMessage += "Password must contain at least one special character. ";
  }

  return { isStrong: isStrong, message: errorMessage.trim() };
}
