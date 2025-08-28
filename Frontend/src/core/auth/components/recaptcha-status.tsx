import React from "react";
import { phoneAuthService } from "../services/phone-auth.service";

export const RecaptchaStatus: React.FC = () => {
  const status = phoneAuthService.getRecaptchaStatus();

  if (!import.meta.env.DEV) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold mb-1">reCAPTCHA Status</div>
      <div>Ready: {status.isReady ? "✅" : "❌"}</div>
      <div>Dev Mode: {status.isDevelopment ? "✅" : "❌"}</div>
      <div>Disabled: {status.isDisabled ? "✅" : "❌"}</div>
    </div>
  );
};
