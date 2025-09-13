"use client";

import { motion } from "framer-motion";
import { Check, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";

interface OtpVerificationStepProps {
  otp: string;
  setOtp: (otp: string) => void;
  phoneNumber: string;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
  resendLoading: boolean;
  cooldownRemaining: number;
  mode: "login" | "signup";
}

export function OtpVerificationStep({
  otp,
  setOtp,
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  loading,
  resendLoading,
  cooldownRemaining,
  mode
}: OtpVerificationStepProps) {
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Enter verification code
        </h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-medium">{phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp" className="text-sm font-medium">
            Verification Code
          </Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otp}
            onChange={handleOtpChange}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground text-center">
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full h-12"
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={loading}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onResend}
              disabled={resendLoading || cooldownRemaining > 0}
              className="flex-1"
            >
              {resendLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : "Resend"}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}