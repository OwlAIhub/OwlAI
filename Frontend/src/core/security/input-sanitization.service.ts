/**
 * Input Sanitization Service
 * Validates and cleans all user inputs before storage to prevent injection attacks and data corruption
 */

import { logger } from "../../shared/utils/logger";

// Sanitization configuration
const SANITIZATION_CONFIG = {
  MAX_LENGTHS: {
    MESSAGE_CONTENT: 10000,
    CONVERSATION_TITLE: 200,
    CONVERSATION_DESCRIPTION: 500,
    USER_NAME: 100,
    EMAIL: 254,
    PHONE: 20,
  },

  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[1-9]\d{1,14}$/,
    USER_ID: /^[a-zA-Z0-9_-]{20,}$/,
    CONVERSATION_ID: /^[a-zA-Z0-9_-]{20,}$/,
    MESSAGE_ID: /^[a-zA-Z0-9_-]{20,}$/,
  },

  FORBIDDEN_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  ],
} as const;

interface SanitizationResult<T> {
  data: T;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitized: boolean;
}

interface SanitizationStats {
  totalInputs: number;
  sanitizedInputs: number;
  rejectedInputs: number;
  averageProcessingTime: number;
  errorRate: number;
}

class InputSanitizationService {
  private static instance: InputSanitizationService;
  private stats: SanitizationStats = {
    totalInputs: 0,
    sanitizedInputs: 0,
    rejectedInputs: 0,
    averageProcessingTime: 0,
    errorRate: 0,
  };

  private constructor() {}

  public static getInstance(): InputSanitizationService {
    if (!InputSanitizationService.instance) {
      InputSanitizationService.instance = new InputSanitizationService();
    }
    return InputSanitizationService.instance;
  }

  /**
   * Sanitize message content
   */
  public sanitizeMessageContent(content: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitized = false;

    try {
      // Check if content is empty
      if (!content || content.trim().length === 0) {
        errors.push("Message content cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Check length
      if (content.length > SANITIZATION_CONFIG.MAX_LENGTHS.MESSAGE_CONTENT) {
        errors.push(
          `Message content exceeds maximum length of ${SANITIZATION_CONFIG.MAX_LENGTHS.MESSAGE_CONTENT} characters`
        );
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Remove forbidden patterns
      let sanitizedContent = content;
      for (const pattern of SANITIZATION_CONFIG.FORBIDDEN_PATTERNS) {
        if (pattern.test(sanitizedContent)) {
          sanitizedContent = sanitizedContent.replace(pattern, "");
          sanitized = true;
          warnings.push("Potentially dangerous content was removed");
        }
      }

      // Trim whitespace
      sanitizedContent = sanitizedContent.trim();

      // Check for excessive whitespace
      if (sanitizedContent.includes("  ")) {
        sanitizedContent = sanitizedContent.replace(/\s+/g, " ");
        sanitized = true;
        warnings.push("Excessive whitespace was normalized");
      }

      // Check for empty content after sanitization
      if (sanitizedContent.length === 0) {
        errors.push("Message content is empty after sanitization");
        return this.createResult(
          "",
          false,
          errors,
          warnings,
          sanitized,
          startTime
        );
      }

      return this.createResult(
        sanitizedContent,
        true,
        errors,
        warnings,
        sanitized,
        startTime
      );
    } catch (error) {
      errors.push("Failed to sanitize message content");
      logger.error(
        "Message content sanitization failed",
        "InputSanitizationService",
        error
      );
      return this.createResult(
        "",
        false,
        errors,
        warnings,
        sanitized,
        startTime
      );
    }
  }

  /**
   * Sanitize conversation title
   */
  public sanitizeConversationTitle(title: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitized = false;

    try {
      // Check if title is empty
      if (!title || title.trim().length === 0) {
        errors.push("Conversation title cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Check length
      if (title.length > SANITIZATION_CONFIG.MAX_LENGTHS.CONVERSATION_TITLE) {
        errors.push(
          `Conversation title exceeds maximum length of ${SANITIZATION_CONFIG.MAX_LENGTHS.CONVERSATION_TITLE} characters`
        );
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Remove forbidden patterns
      let sanitizedTitle = title;
      for (const pattern of SANITIZATION_CONFIG.FORBIDDEN_PATTERNS) {
        if (pattern.test(sanitizedTitle)) {
          sanitizedTitle = sanitizedTitle.replace(pattern, "");
          sanitized = true;
          warnings.push("Potentially dangerous content was removed");
        }
      }

      // Trim whitespace
      sanitizedTitle = sanitizedTitle.trim();

      // Check for empty title after sanitization
      if (sanitizedTitle.length === 0) {
        errors.push("Conversation title is empty after sanitization");
        return this.createResult(
          "",
          false,
          errors,
          warnings,
          sanitized,
          startTime
        );
      }

      return this.createResult(
        sanitizedTitle,
        true,
        errors,
        warnings,
        sanitized,
        startTime
      );
    } catch (error) {
      errors.push("Failed to sanitize conversation title");
      logger.error(
        "Conversation title sanitization failed",
        "InputSanitizationService",
        error
      );
      return this.createResult(
        "",
        false,
        errors,
        warnings,
        sanitized,
        startTime
      );
    }
  }

  /**
   * Sanitize conversation description
   */
  public sanitizeConversationDescription(
    description: string
  ): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitized = false;

    try {
      // Description can be empty
      if (!description) {
        return this.createResult("", true, errors, warnings, false, startTime);
      }

      // Check length
      if (
        description.length >
        SANITIZATION_CONFIG.MAX_LENGTHS.CONVERSATION_DESCRIPTION
      ) {
        errors.push(
          `Conversation description exceeds maximum length of ${SANITIZATION_CONFIG.MAX_LENGTHS.CONVERSATION_DESCRIPTION} characters`
        );
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Remove forbidden patterns
      let sanitizedDescription = description;
      for (const pattern of SANITIZATION_CONFIG.FORBIDDEN_PATTERNS) {
        if (pattern.test(sanitizedDescription)) {
          sanitizedDescription = sanitizedDescription.replace(pattern, "");
          sanitized = true;
          warnings.push("Potentially dangerous content was removed");
        }
      }

      // Trim whitespace
      sanitizedDescription = sanitizedDescription.trim();

      return this.createResult(
        sanitizedDescription,
        true,
        errors,
        warnings,
        sanitized,
        startTime
      );
    } catch (error) {
      errors.push("Failed to sanitize conversation description");
      logger.error(
        "Conversation description sanitization failed",
        "InputSanitizationService",
        error
      );
      return this.createResult(
        "",
        false,
        errors,
        warnings,
        sanitized,
        startTime
      );
    }
  }

  /**
   * Validate email address
   */
  public validateEmail(email: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if email is empty
      if (!email || email.trim().length === 0) {
        errors.push("Email address cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Check length
      if (email.length > SANITIZATION_CONFIG.MAX_LENGTHS.EMAIL) {
        errors.push(
          `Email address exceeds maximum length of ${SANITIZATION_CONFIG.MAX_LENGTHS.EMAIL} characters`
        );
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Trim whitespace
      const sanitizedEmail = email.trim().toLowerCase();

      // Validate email format
      if (!SANITIZATION_CONFIG.PATTERNS.EMAIL.test(sanitizedEmail)) {
        errors.push("Invalid email address format");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      return this.createResult(
        sanitizedEmail,
        true,
        errors,
        warnings,
        false,
        startTime
      );
    } catch (error) {
      errors.push("Failed to validate email address");
      logger.error(
        "Email validation failed",
        "InputSanitizationService",
        error
      );
      return this.createResult("", false, errors, warnings, false, startTime);
    }
  }

  /**
   * Validate phone number
   */
  public validatePhoneNumber(phone: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if phone is empty
      if (!phone || phone.trim().length === 0) {
        errors.push("Phone number cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Check length
      if (phone.length > SANITIZATION_CONFIG.MAX_LENGTHS.PHONE) {
        errors.push(
          `Phone number exceeds maximum length of ${SANITIZATION_CONFIG.MAX_LENGTHS.PHONE} characters`
        );
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Remove all non-digit characters except +
      const sanitizedPhone = phone.replace(/[^\d+]/g, "");

      // Validate phone format
      if (!SANITIZATION_CONFIG.PATTERNS.PHONE.test(sanitizedPhone)) {
        errors.push("Invalid phone number format");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      return this.createResult(
        sanitizedPhone,
        true,
        errors,
        warnings,
        false,
        startTime
      );
    } catch (error) {
      errors.push("Failed to validate phone number");
      logger.error(
        "Phone number validation failed",
        "InputSanitizationService",
        error
      );
      return this.createResult("", false, errors, warnings, false, startTime);
    }
  }

  /**
   * Validate user ID
   */
  public validateUserId(userId: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if user ID is empty
      if (!userId || userId.trim().length === 0) {
        errors.push("User ID cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Validate user ID format
      if (!SANITIZATION_CONFIG.PATTERNS.USER_ID.test(userId)) {
        errors.push("Invalid user ID format");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      return this.createResult(
        userId,
        true,
        errors,
        warnings,
        false,
        startTime
      );
    } catch (error) {
      errors.push("Failed to validate user ID");
      logger.error(
        "User ID validation failed",
        "InputSanitizationService",
        error
      );
      return this.createResult("", false, errors, warnings, false, startTime);
    }
  }

  /**
   * Validate conversation ID
   */
  public validateConversationId(
    conversationId: string
  ): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if conversation ID is empty
      if (!conversationId || conversationId.trim().length === 0) {
        errors.push("Conversation ID cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Validate conversation ID format
      if (!SANITIZATION_CONFIG.PATTERNS.CONVERSATION_ID.test(conversationId)) {
        errors.push("Invalid conversation ID format");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      return this.createResult(
        conversationId,
        true,
        errors,
        warnings,
        false,
        startTime
      );
    } catch (error) {
      errors.push("Failed to validate conversation ID");
      logger.error(
        "Conversation ID validation failed",
        "InputSanitizationService",
        error
      );
      return this.createResult("", false, errors, warnings, false, startTime);
    }
  }

  /**
   * Validate message ID
   */
  public validateMessageId(messageId: string): SanitizationResult<string> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if message ID is empty
      if (!messageId || messageId.trim().length === 0) {
        errors.push("Message ID cannot be empty");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      // Validate message ID format
      if (!SANITIZATION_CONFIG.PATTERNS.MESSAGE_ID.test(messageId)) {
        errors.push("Invalid message ID format");
        return this.createResult("", false, errors, warnings, false, startTime);
      }

      return this.createResult(
        messageId,
        true,
        errors,
        warnings,
        false,
        startTime
      );
    } catch (error) {
      errors.push("Failed to validate message ID");
      logger.error(
        "Message ID validation failed",
        "InputSanitizationService",
        error
      );
      return this.createResult("", false, errors, warnings, false, startTime);
    }
  }

  /**
   * Sanitize user input object
   */
  public sanitizeUserInput(input: any): SanitizationResult<any> {
    const startTime = Date.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    let sanitized = false;

    try {
      const sanitizedInput = { ...input };

      // Sanitize each field based on type
      if (sanitizedInput.content) {
        const contentResult = this.sanitizeMessageContent(
          sanitizedInput.content
        );
        if (contentResult.isValid) {
          sanitizedInput.content = contentResult.data;
          if (contentResult.sanitized) sanitized = true;
          warnings.push(...contentResult.warnings);
        } else {
          errors.push(...contentResult.errors);
        }
      }

      if (sanitizedInput.title) {
        const titleResult = this.sanitizeConversationTitle(
          sanitizedInput.title
        );
        if (titleResult.isValid) {
          sanitizedInput.title = titleResult.data;
          if (titleResult.sanitized) sanitized = true;
          warnings.push(...titleResult.warnings);
        } else {
          errors.push(...titleResult.errors);
        }
      }

      if (sanitizedInput.description) {
        const descriptionResult = this.sanitizeConversationDescription(
          sanitizedInput.description
        );
        if (descriptionResult.isValid) {
          sanitizedInput.description = descriptionResult.data;
          if (descriptionResult.sanitized) sanitized = true;
          warnings.push(...descriptionResult.warnings);
        } else {
          errors.push(...descriptionResult.errors);
        }
      }

      if (sanitizedInput.email) {
        const emailResult = this.validateEmail(sanitizedInput.email);
        if (emailResult.isValid) {
          sanitizedInput.email = emailResult.data;
        } else {
          errors.push(...emailResult.errors);
        }
      }

      if (sanitizedInput.phone_number) {
        const phoneResult = this.validatePhoneNumber(
          sanitizedInput.phone_number
        );
        if (phoneResult.isValid) {
          sanitizedInput.phone_number = phoneResult.data;
        } else {
          errors.push(...phoneResult.errors);
        }
      }

      const isValid = errors.length === 0;
      return this.createResult(
        sanitizedInput,
        isValid,
        errors,
        warnings,
        sanitized,
        startTime
      );
    } catch (error) {
      errors.push("Failed to sanitize user input");
      logger.error(
        "User input sanitization failed",
        "InputSanitizationService",
        error
      );
      return this.createResult(
        input,
        false,
        errors,
        warnings,
        sanitized,
        startTime
      );
    }
  }

  /**
   * Create sanitization result
   */
  private createResult<T>(
    data: T,
    isValid: boolean,
    errors: string[],
    warnings: string[],
    sanitized: boolean,
    startTime: number
  ): SanitizationResult<T> {
    const processingTime = Date.now() - startTime;
    this.updateStats(isValid, sanitized, processingTime);

    return {
      data,
      isValid,
      errors,
      warnings,
      sanitized,
    };
  }

  /**
   * Update sanitization statistics
   */
  private updateStats(
    isValid: boolean,
    sanitized: boolean,
    processingTime: number
  ): void {
    this.stats.totalInputs++;

    if (sanitized) {
      this.stats.sanitizedInputs++;
    }

    if (!isValid) {
      this.stats.rejectedInputs++;
    }

    this.stats.averageProcessingTime =
      (this.stats.averageProcessingTime * (this.stats.totalInputs - 1) +
        processingTime) /
      this.stats.totalInputs;

    this.stats.errorRate =
      this.stats.totalInputs > 0
        ? (this.stats.rejectedInputs / this.stats.totalInputs) * 100
        : 0;
  }

  /**
   * Get sanitization statistics
   */
  public getSanitizationStats(): SanitizationStats {
    return { ...this.stats };
  }

  /**
   * Reset sanitization statistics
   */
  public resetStats(): void {
    this.stats = {
      totalInputs: 0,
      sanitizedInputs: 0,
      rejectedInputs: 0,
      averageProcessingTime: 0,
      errorRate: 0,
    };
  }

  /**
   * Check if input contains potentially dangerous content
   */
  public containsDangerousContent(input: string): boolean {
    for (const pattern of SANITIZATION_CONFIG.FORBIDDEN_PATTERNS) {
      if (pattern.test(input)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get sanitization configuration
   */
  public getConfig() {
    return { ...SANITIZATION_CONFIG };
  }
}

// Export singleton instance
export const inputSanitizationService = InputSanitizationService.getInstance();

// Export types
export type { SanitizationResult, SanitizationStats };
