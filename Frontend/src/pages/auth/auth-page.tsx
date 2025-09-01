import React, { useState } from "react";
import { Phone, GalleryVerticalEnd, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../utils";

export default function AuthPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and basic phone characters
    if (/^[\d\s+\-()]*$/.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleBack = () => {
    if (isOtpSent) {
      setIsOtpSent(false);
      setOtp("");
    } else {
      // Navigate back to landing page
      window.history.back();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsOtpSent(true);
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful verification
    alert("Phone number verified successfully!");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className={cn("flex flex-col gap-6")}>
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="self-start text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 p-2 h-auto"
          >
            <ArrowLeft className="size-4 mr-2" />
            {isOtpSent ? "Back to Phone" : "Back"}
          </Button>

          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                    <GalleryVerticalEnd className="size-7 text-white" />
                  </div>
                  <span className="sr-only">Owl AI</span>
                </a>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome to Owl AI
                </h1>
                <p className="text-center text-base text-gray-700 dark:text-gray-300 max-w-sm">
                  Your intelligent companion for seamless conversations and
                  smart assistance
                </p>
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {isOtpSent
                    ? "Enter the OTP sent to your phone"
                    : "Sign in with your phone number to get started"}
                </div>

                {!isOtpSent && (
                  <div className="mt-4 text-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                      ✨ What you&apos;ll get:
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 text-xs">
                      <span className="px-3 py-1.5 bg-teal-500/10 text-teal-700 dark:text-teal-300 rounded-full border border-teal-200/50 dark:border-teal-700/30">
                        Smart Conversations
                      </span>
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200/50 dark:border-emerald-700/30">
                        AI Assistance
                      </span>
                      <span className="px-3 py-1.5 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/30">
                        Secure & Private
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-6">
                {!isOtpSent ? (
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <Label htmlFor="otp">OTP</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      maxLength={6}
                      required
                    />
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                      Didn&apos;t receive OTP?{" "}
                      <button
                        type="button"
                        onClick={() => setIsOtpSent(false)}
                        className="text-teal-600 hover:text-teal-700 underline underline-offset-4"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : isOtpSent
                      ? "Verify OTP"
                      : "Send OTP"}
                </Button>
              </div>
            </div>
          </form>

          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#" className="text-teal-600">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-teal-600">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
