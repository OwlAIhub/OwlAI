/**
 * Input Validation and Sanitization Utilities
 * Provides comprehensive validation and sanitization for user inputs
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  sanitize?: boolean;
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitize text content (remove potentially dangerous characters)
 */
export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data: protocol
    .replace(/vbscript:/gi, ""); // Remove vbscript: protocol
}

/**
 * Validate and sanitize email address
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  const sanitizedEmail = email.trim().toLowerCase();

  if (!sanitizedEmail) {
    errors.push("Email is required");
    return { isValid: false, errors };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(sanitizedEmail)) {
    errors.push("Invalid email format");
    return { isValid: false, errors };
  }

  if (sanitizedEmail.length > 254) {
    errors.push("Email is too long");
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [], sanitizedValue: sanitizedEmail };
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  const sanitizedPhone = phone.replace(/\D/g, ""); // Remove non-digits

  if (!sanitizedPhone) {
    errors.push("Phone number is required");
    return { isValid: false, errors };
  }

  if (sanitizedPhone.length < 10 || sanitizedPhone.length > 15) {
    errors.push("Phone number must be between 10 and 15 digits");
    return { isValid: false, errors };
  }

  return { isValid: true, errors: [], sanitizedValue: sanitizedPhone };
}

/**
 * Validate and sanitize text input
 */
export function validateText(
  input: string,
  rules: ValidationRule = {}
): ValidationResult {
  const errors: string[] = [];
  let sanitizedValue = input;

  // Sanitize if requested
  if (rules.sanitize !== false) {
    sanitizedValue = sanitizeText(input);
  }

  // Required validation
  if (rules.required && !sanitizedValue) {
    errors.push("This field is required");
    return { isValid: false, errors };
  }

  // Skip other validations if empty and not required
  if (!sanitizedValue) {
    return { isValid: true, errors: [], sanitizedValue };
  }

  // Length validations
  if (rules.minLength && sanitizedValue.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength} characters`);
  }

  if (rules.maxLength && sanitizedValue.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength} characters`);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(sanitizedValue)) {
    errors.push("Invalid format");
  }

  // Custom validation
  if (rules.custom && !rules.custom(sanitizedValue)) {
    errors.push("Invalid value");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedValue,
  };
}

/**
 * Validate and sanitize message content
 */
export function validateMessage(message: string): ValidationResult {
  return validateText(message, {
    required: true,
    minLength: 1,
    maxLength: 4000, // Match config maxMessageLength
    sanitize: true,
    custom: value => {
      // Check for potentially dangerous content
      const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /data:text\/html/gi,
      ];

      return !dangerousPatterns.some(pattern => pattern.test(value));
    },
  });
}

/**
 * Validate form data object
 */
export function validateFormData(
  data: Record<string, string | number | boolean>,
  schema: Record<string, ValidationRule>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field] || "";
    results[field] = validateText(value, rules);
  }

  return results;
}

/**
 * Check if form is valid
 */
export function isFormValid(
  results: Record<string, ValidationResult>
): boolean {
  return Object.values(results).every(result => result.isValid);
}

/**
 * Get all form errors
 */
export function getFormErrors(
  results: Record<string, ValidationResult>
): string[] {
  return Object.values(results)
    .flatMap(result => result.errors)
    .filter(Boolean);
}
