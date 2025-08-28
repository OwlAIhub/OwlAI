/**
 * Phone Authentication Types
 * Type definitions for phone authentication functionality
 */

import { ConfirmationResult } from "firebase/auth";

export interface PhoneAuthState {
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  isCodeSent: boolean;
  isVerifying: boolean;
  error: string | null;
  verificationId: string | null;
}
