/**
 * Shared form validation rules for the auth screens.
 *
 * Deliberately dependency-free and free of React/Next imports so the same
 * rules back every form, can be unit tested on their own, and can be reused
 * by future screens (profile, upload, ...).
 *
 * Every validator returns the error message to display, or `undefined` when
 * the value is acceptable.
 */

export const NAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Pragmatic email check: a single "@", no whitespace, and a dotted domain
 * with a TLD of at least two characters. Not RFC-complete by design — the
 * backend remains the source of truth for deliverability.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Field name -> error message. A missing key means "valid". */
export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/** Required check for fields that need no other rule (e.g. sign-in password). */
export function validateRequired(
  value: string,
  label: string
): string | undefined {
  if (isBlank(value)) return `${label} is required`;
  return undefined;
}

export function validateFullName(value: string): string | undefined {
  if (isBlank(value)) return "Full name is required";
  if (value.trim().length < NAME_MIN_LENGTH) {
    return `Full name must be at least ${NAME_MIN_LENGTH} characters`;
  }
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  if (isBlank(value)) return "Email is required";
  if (!EMAIL_PATTERN.test(value.trim())) {
    return "Enter a valid email address";
  }
  return undefined;
}

export function validateNewPassword(value: string): string | undefined {
  if (isBlank(value)) return "Password is required";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (isBlank(confirmPassword)) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
}
