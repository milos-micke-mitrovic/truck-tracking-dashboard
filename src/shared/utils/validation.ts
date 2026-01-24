/**
 * Shared validation utilities for consistent form validation across the app.
 */

/**
 * Email regex pattern that requires:
 * - At least one character before @
 * - @ symbol
 * - At least one character for domain name
 * - A dot
 * - At least two characters for TLD
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/**
 * Creates a validation rule object for React Hook Form email fields
 * @param requiredMessage - Message to show when field is empty
 * @param invalidMessage - Message to show when email format is invalid
 * @param isRequired - Whether the field is required (default: true)
 */
export function emailValidationRules(
  requiredMessage: string,
  invalidMessage: string,
  isRequired = true
) {
  return {
    ...(isRequired && { required: requiredMessage }),
    pattern: {
      value: EMAIL_REGEX,
      message: invalidMessage,
    },
  }
}
