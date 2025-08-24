import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isLoggedIn,
}) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
