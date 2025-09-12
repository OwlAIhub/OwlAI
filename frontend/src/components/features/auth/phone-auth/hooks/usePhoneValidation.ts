import { useState, useCallback } from "react";
import { validatePhoneNumber } from "@/lib/utils/phoneValidation";

interface PhoneValidation {
  isValid: boolean;
  formatted: string;
  country?: string;
  error?: string;
}

export function usePhoneValidation() {
  const [validation, setValidation] = useState<PhoneValidation>({
    isValid: false,
    formatted: "",
    country: undefined,
    error: undefined
  });

  const validateAndSetPhoneNumber = useCallback((phone: string) => {
    const validationResult = validatePhoneNumber(phone);
    setValidation({
      isValid: validationResult.isValid,
      formatted: validationResult.formatted,
      country: validationResult.country,
      error: validationResult.error,
    });
  }, []);

  return {
    validation,
    validateAndSetPhoneNumber
  };
}