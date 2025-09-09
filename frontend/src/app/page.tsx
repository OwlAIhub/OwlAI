"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import MainPage from "@/components/sections/mainpage";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to chat
    if (user && !loading) {
      console.log('User is authenticated, redirecting to chat...');
      router.push("/chat");
    } else if (!loading && !user) {
      console.log('User is not authenticated, showing landing page');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth state
  if (loading) {
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
