"use client";

import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/inputs/input";
import { Label } from "@/components/ui/inputs/label";
import { formatPhoneNumber } from "@/lib/utils/phoneValidation";

interface PhoneInputStepProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  validation: {
    isValid: boolean;
    formatted: string;
    country?: string;
    error?: string;
  };
  validateAndSetPhoneNumber: (phone: string) => void;
  onSubmit: () => void;
  loading: boolean;
  mode: "login" | "signup";
}

export function PhoneInputStep({
  phoneNumber,
  setPhoneNumber,
  validation,
  validateAndSetPhoneNumber,
  onSubmit,
  loading,
  mode
}: PhoneInputStepProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawPhone = e.target.value;
    const formatted = formatPhoneNumber(rawPhone);
    setPhoneNumber(formatted);
    validateAndSetPhoneNumber(rawPhone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
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
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {mode === "login" ? "Welcome back" : "Let's get started"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "login" 
            ? "Sign in to your account with your phone number"
            : "Create your account with your phone number"
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`pl-4 ${
                phoneNumber && !validation.isValid 
                  ? "border-destructive focus:border-destructive" 
                  : validation.isValid 
                  ? "border-green-500 focus:border-green-500" 
                  : ""
              }`}
              disabled={loading}
            />
          </div>
          
          {phoneNumber && validation.country && (
            <p className="text-xs text-muted-foreground">
              Detected: {validation.country}
            </p>
          )}

          {phoneNumber && !validation.isValid && validation.error && (
            <p className="text-sm text-destructive">
              {validation.error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12"
          disabled={loading || !validation.isValid}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}