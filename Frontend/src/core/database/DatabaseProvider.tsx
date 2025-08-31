/**
 * Database Provider
 * Provides database services and initialization state to the app
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { initializeFirestore } from "./firestore.config";
import { logger } from "../../shared/utils/logger";

interface DatabaseContextType {
  isInitialized: boolean;
  isError: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        logger.info("Initializing database...", "DatabaseProvider");
        await initializeFirestore();
        setIsInitialized(true);
        logger.info("Database initialized successfully", "DatabaseProvider");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown database error";
        logger.error("Failed to initialize database", "DatabaseProvider", err);
        setIsError(true);
        setError(errorMessage);
      }
    };

    initDatabase();
  }, []);

  const value: DatabaseContextType = {
    isInitialized,
    isError,
    error,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};
