import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  authReady: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isLoggedIn,
  authReady,
  redirectTo = "/login",
}) => {
  if (!authReady) {
    return null; // or a loading spinner
  }

  return isLoggedIn ? <>{children}</> : <Navigate to={redirectTo} replace />;
};
