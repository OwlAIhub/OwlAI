// Firebase environment and API check utility

/**
 * Check if all required Firebase environment variables are set
 */
export function checkFirebaseConfig(): boolean {
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  // Only log missing environment variables in development
  // In production, we use hardcoded fallback values
  if (missingVars.length > 0 && process.env.NODE_ENV === "development") {
    console.error("Missing Firebase environment variables:", missingVars);
    return false;
  }

  return true;
}

/**
 * Handle Firebase API permission errors gracefully
 */
export function handleFirebaseError(error: unknown): string {
  const errorObj = error as { code?: string; message?: string };

  if (errorObj?.code === "installations/request-failed") {
    console.warn(
      "Firebase Installations API blocked - this is expected in development",
    );
    return "Firebase service temporarily unavailable. Please try again later.";
  }

  if (errorObj?.code === "permission-denied") {
    console.warn("Firebase permission denied - check Firestore rules");
    return "Permission denied. Please check your access rights.";
  }

  if (errorObj?.message?.includes("PERMISSION_DENIED")) {
    console.warn("Firebase API permission denied:", errorObj.message);
    return "Service temporarily unavailable. Please try again later.";
  }

  return errorObj?.message || "An unexpected error occurred";
}

/**
 * Initialize Firebase with error handling
 */
export function initializeFirebaseWithErrorHandling() {
  if (!checkFirebaseConfig()) {
    throw new Error("Firebase configuration is incomplete");
  }

  // Suppress Firebase Installations API errors in development
  if (process.env.NODE_ENV === "development") {
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(" ");
      if (
        message.includes("firebaseinstallations.googleapis.com") ||
        message.includes("installations/request-failed")
      ) {
        // Suppress these specific errors in development
        return;
      }
      originalError.apply(console, args);
    };
  }
}
