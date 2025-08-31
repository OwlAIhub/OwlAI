/**
 * Database Utilities
 * Common utility functions for database operations
 */

import { writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";

/**
 * Create a batch operation for multiple database writes
 */
export const createBatch = () => {
  return writeBatch(db);
};

/**
 * Execute a batch operation with error handling
 */
export const executeBatch = async (batch: ReturnType<typeof writeBatch>) => {
  try {
    await batch.commit();
    logger.info("Batch operation completed successfully", "DatabaseUtils");
  } catch (error) {
    logger.error("Batch operation failed", "DatabaseUtils", error);
    throw error;
  }
};

/**
 * Add timestamp fields to a document
 */
export const addTimestamps = (data: any) => {
  return {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };
};

/**
 * Update timestamp for a document
 */
export const updateTimestamp = (data: any) => {
  return {
    ...data,
    updated_at: serverTimestamp(),
  };
};

/**
 * Validate required fields in a document
 */
export const validateRequiredFields = (
  data: any,
  requiredFields: string[]
): boolean => {
  for (const field of requiredFields) {
    if (!data[field]) {
      logger.error(`Missing required field: ${field}`, "DatabaseUtils");
      return false;
    }
  }
  return true;
};

/**
 * Sanitize data before saving to database
 */
export const sanitizeData = (data: any): any => {
  const sanitized = { ...data };

  // Remove undefined values
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });

  return sanitized;
};

/**
 * Generate a unique document ID
 */
export const generateDocumentId = (): string => {
  return doc(db, "temp", "temp").id;
};

/**
 * Retry a database operation with exponential backoff
 */
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      logger.warn(
        `Database operation failed, retrying in ${delay}ms (attempt ${
          attempt + 1
        }/${maxRetries + 1})`,
        "DatabaseUtils",
        error
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};
