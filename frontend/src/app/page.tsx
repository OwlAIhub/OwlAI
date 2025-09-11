"use client";

import MainPage from "@/components/sections/mainpage";
import { useAuth } from "@/lib/contexts/AuthContext";
import { hasCompletedOnboarding } from "@/lib/services/onboardingService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  useEffect(() => {
    const handleAuthenticatedUser = async () => {
      if (user && !loading) {
        setCheckingOnboarding(true);
        try {
          const onboardingCompleted = await hasCompletedOnboarding(user.uid);
          if (onboardingCompleted) {
            console.log("User has completed onboarding, redirecting to chat...");
            router.push("/chat");
          } else {
            console.log("User needs to complete onboarding, redirecting to onboarding...");
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // Default to onboarding if we can't check
          router.push("/onboarding");
        } finally {
          setCheckingOnboarding(false);
        }
      } else if (!loading && !user) {
        console.log("User is not authenticated, showing landing page");
      }
    };

    handleAuthenticatedUser();
  }, [user, loading, router]);

  // Show loading spinner while checking auth state or onboarding
  if (loading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show landing page only for unauthenticated users
  if (!user) {
    return <MainPage />;
  }

  // This shouldn't render, but just in case
  return null;
}
