export function validateStringNotNullOrBlank(value: any): boolean {
  if (typeof value !== "string") {
    return false;
  }

  return !(!value || value.trim().length === 0);
}
