export function validateStringNotNullOrBlank(value: any): boolean {
  if (typeof value !== "string") {
    return false;
  }

  if (!value || value.trim().length === 0) {
    return false;
  }

  return true;
}
