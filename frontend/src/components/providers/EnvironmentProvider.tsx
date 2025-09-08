"use client";

import { useEffect, useState } from "react";

interface EnvironmentProviderProps {
  children: React.ReactNode;
}

export function EnvironmentProvider({ children }: EnvironmentProviderProps) {
  const [isValid] = useState(true);
  const [validationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Skip client-side validation since process.env is not fully available on client
    // Environment validation happens at build time in next.config.ts
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log(
        "Environment Provider loaded - validation handled at build time",
      );
    }
  }, []);

  // In production, we assume environment is valid if the app loaded
  // In development, show errors if validation failed
  if (process.env.NODE_ENV === "development" && !isValid) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-red-800">
              Environment Configuration Error
            </h2>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-red-700">
              The following environment variables are missing or invalid:
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>

          <div className="bg-red-100 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>To fix this:</strong>
            </p>
            <ol className="text-sm text-red-700 mt-2 space-y-1 list-decimal list-inside">
              <li>
                Check your{" "}
                <code className="bg-red-200 px-1 rounded">.env.local</code> file
              </li>
              <li>
                Ensure all required Firebase environment variables are set
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
