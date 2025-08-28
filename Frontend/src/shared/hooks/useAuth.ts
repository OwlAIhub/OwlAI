import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token/session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Verify token with backend
          // For now, just set a mock user
          setUser({ id: "1", email: "user@example.com", name: "User" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    try {
      // Implement actual login logic here
      // For now, just simulate a successful login
      const mockUser = { id: "1", email, name: "User" };
      setUser(mockUser);
      localStorage.setItem("authToken", "mock-token");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const register = async (email: string, _password: string, name?: string) => {
    setLoading(true);
    try {
      // Implement actual registration logic here
      // For now, just simulate a successful registration
      const mockUser = { id: "1", email, name: name || "User" };
      setUser(mockUser);
      localStorage.setItem("authToken", "mock-token");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    register,
  };
};
