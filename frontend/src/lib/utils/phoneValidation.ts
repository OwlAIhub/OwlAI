// ========================================
// PRODUCTION-LEVEL PHONE NUMBER VALIDATION
// ========================================
// International phone number validation with country-specific rules
// Supports E.164 format and regional formatting

interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  country: string;
  countryCode: string;
  nationalNumber: string;
  error?: string;
}

interface CountryConfig {
  code: string;
  name: string;
  prefix: string;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  format: (number: string) => string;
}

// ========================================
// COUNTRY CONFIGURATIONS
// ========================================

const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  IN: {
    code: 'IN',
    name: 'India',
    prefix: '+91',
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
    format: (number: string) => {
      // Format: +91 98765 43210
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }
  },
  US: {
    code: 'US',
    name: 'United States',
    prefix: '+1',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    format: (number: string) => {
      // Format: +1 (555) 123-4567
      return `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    prefix: '+44',
    minLength: 10,
    maxLength: 11,
    pattern: /^[1-9]\d{8,9}$/,
    format: (number: string) => {
      // Format: +44 20 1234 5678
      if (number.length === 10) {
        return `+44 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`;
      } else {
        return `+44 ${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`;
      }
    }
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    prefix: '+61',
    minLength: 9,
    maxLength: 9,
    pattern: /^[2-9]\d{8}$/,
    format: (number: string) => {
      // Format: +61 2 1234 5678
      return `+61 ${number.slice(0, 1)} ${number.slice(1, 5)} ${number.slice(5)}`;
    }
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    prefix: '+1',
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{2}[2-9]\d{2}\d{4}$/,
    format: (number: string) => {
      // Format: +1 (555) 123-4567
      return `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
  }
};

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Clean phone number by removing all non-digit characters except +
 */
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Extract country code and national number from E.164 format
 */
function parseE164(phone: string): { countryCode: string; nationalNumber: string } | null {
  if (!phone.startsWith('+')) {
    return null;
  }

  // Try to match against known country codes
  for (const config of Object.values(COUNTRY_CONFIGS)) {
    if (phone.startsWith(config.prefix)) {
      return {
        countryCode: config.prefix,
        nationalNumber: phone.slice(config.prefix.length)
      };
    }
  }

  return null;
}

/**
 * Validate phone number format using E.164 standard
 */
function validateE164Format(phone: string): boolean {
  // E.164 format: +[1-9][0-15 digits]
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  return e164Pattern.test(phone);
}

/**
 * Detect country from phone number
 */
function detectCountry(phone: string): CountryConfig | null {
  const cleaned = cleanPhoneNumber(phone);
  
  if (cleaned.startsWith('+')) {
    for (const config of Object.values(COUNTRY_CONFIGS)) {
      if (cleaned.startsWith(config.prefix)) {
        return config;
      }
    }
  }
  
  // Default to India for numbers without country code
  // This is specific to your Indian app - adjust as needed
  return COUNTRY_CONFIGS.IN;
}

/**
 * Validate national number format for specific country
 */
function validateNationalNumber(nationalNumber: string, config: CountryConfig): boolean {
  if (nationalNumber.length < config.minLength || nationalNumber.length > config.maxLength) {
    return false;
  }
  
  return config.pattern.test(nationalNumber);
}

// ========================================
// MAIN VALIDATION FUNCTION
// ========================================

/**
 * Comprehensive phone number validation
 * Supports international formats and provides detailed feedback
 */
export function validatePhoneNumber(phone: string): PhoneValidationResult {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      formatted: '',
      country: '',
      countryCode: '',
      nationalNumber: '',
      error: 'Phone number is required'
    };
  }

  const cleaned = cleanPhoneNumber(phone.trim());

  // Handle empty result after cleaning
  if (!cleaned) {
    return {
      isValid: false,
      formatted: '',
      country: '',
      countryCode: '',
      nationalNumber: '',
      error: 'Invalid phone number format'
    };
  }

  // Detect country
  const countryConfig = detectCountry(cleaned);
  if (!countryConfig) {
    return {
      isValid: false,
      formatted: '',
      country: '',
      countryCode: '',
      nationalNumber: '',
      error: 'Unsupported country code'
    };
  }

  let formattedNumber: string;
  let nationalNumber: string;

  // Handle numbers with country code
  if (cleaned.startsWith('+')) {
    if (!validateE164Format(cleaned)) {
      return {
        isValid: false,
        formatted: '',
        country: countryConfig.name,
        countryCode: countryConfig.prefix,
        nationalNumber: '',
        error: 'Invalid international phone number format'
      };
    }

    const parsed = parseE164(cleaned);
    if (!parsed) {
      return {
        isValid: false,
        formatted: '',
        country: countryConfig.name,
        countryCode: countryConfig.prefix,
        nationalNumber: '',
        error: 'Unable to parse phone number'
      };
    }

    nationalNumber = parsed.nationalNumber;
    formattedNumber = cleaned;
  } else {
    // Handle numbers without country code (assume local)
    nationalNumber = cleaned;
    formattedNumber = countryConfig.prefix + cleaned;
  }

  // Validate national number format
  if (!validateNationalNumber(nationalNumber, countryConfig)) {
    const lengthError = nationalNumber.length < countryConfig.minLength 
      ? `Phone number too short (minimum ${countryConfig.minLength} digits)`
      : nationalNumber.length > countryConfig.maxLength 
        ? `Phone number too long (maximum ${countryConfig.maxLength} digits)`
        : `Invalid phone number format for ${countryConfig.name}`;
    
    return {
      isValid: false,
      formatted: '',
      country: countryConfig.name,
      countryCode: countryConfig.prefix,
      nationalNumber,
      error: lengthError
    };
  }

  // Final validation for E.164 format
  if (!validateE164Format(formattedNumber)) {
    return {
      isValid: false,
      formatted: '',
      country: countryConfig.name,
      countryCode: countryConfig.prefix,
      nationalNumber,
      error: 'Invalid E.164 format'
    };
  }

  return {
    isValid: true,
    formatted: formattedNumber,
    country: countryConfig.name,
    countryCode: countryConfig.prefix,
    nationalNumber,
  };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const validation = validatePhoneNumber(phone);
  if (!validation.isValid) {
    return phone; // Return original if invalid
  }

  const countryConfig = Object.values(COUNTRY_CONFIGS).find(
    config => config.prefix === validation.countryCode
  );

  if (countryConfig) {
    return countryConfig.format(validation.nationalNumber);
  }

  return validation.formatted;
}

/**
 * Check if phone number is from a specific country
 */
export function isPhoneFromCountry(phone: string, countryCode: string): boolean {
  const validation = validatePhoneNumber(phone);
  return validation.isValid && validation.countryCode === COUNTRY_CONFIGS[countryCode]?.prefix;
}

/**
 * Get list of supported countries
 */
export function getSupportedCountries(): Array<{code: string; name: string; prefix: string}> {
  return Object.values(COUNTRY_CONFIGS).map(config => ({
    code: config.code,
    name: config.name,
    prefix: config.prefix
  }));
}

/**
 * Validate multiple phone numbers
 */
export function validatePhoneNumbers(phones: string[]): PhoneValidationResult[] {
  return phones.map(validatePhoneNumber);
}

/**
 * Check if phone number is likely a test/fake number
 */
export function isTestPhoneNumber(phone: string): boolean {
  const testPatterns = [
    /^\+1234567890$/,     // Common test number
    /^\+9876543210$/,     // Common test number
    /^\+11111111111$/,    // Repeated digits
    /^\+12345678901$/,    // Sequential digits
    /^\+10000000000$/,    // Zeros pattern
  ];

  const cleaned = cleanPhoneNumber(phone);
  return testPatterns.some(pattern => pattern.test(cleaned));
}

// ========================================
// EXPORTS
// ========================================

export { COUNTRY_CONFIGS };
export type { PhoneValidationResult, CountryConfig };