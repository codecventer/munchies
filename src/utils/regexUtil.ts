export function isValidateEmail(emailAddress: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(emailAddress);
}
