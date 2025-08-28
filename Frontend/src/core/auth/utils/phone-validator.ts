/**
 * Phone Number Validator
 * Validates phone number formats and country codes
 */

class PhoneNumberValidator {
  private readonly validCountryCodes = [
    "1",
    "44",
    "91",
    "86",
    "81",
    "49",
    "33",
    "39",
    "34",
    "7",
    "55",
    "52",
    "61",
    "31",
    "46",
    "48",
    "36",
    "43",
    "32",
    "45",
  ];

  /**
   * Validate phone number format
   */
  public isValid(phoneNumber: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+[1-9]\d{10,14}$/;

    if (!phoneRegex.test(cleaned)) {
      return false;
    }

    // Validate country code
    const countryCode = cleaned.substring(1, 3);
    return this.validCountryCodes.includes(countryCode);
  }
}

// Export singleton instance
export const phoneNumberValidator = new PhoneNumberValidator();
