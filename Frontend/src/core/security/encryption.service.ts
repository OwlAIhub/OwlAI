/**
 * Encryption Service
 * Handles data encryption at rest for sensitive conversation data and PII protection
 */

import { logger } from "../../shared/utils/logger";

// Encryption configuration
const ENCRYPTION_CONFIG = {
  ALGORITHM: "AES-GCM",
  KEY_LENGTH: 256,
  IV_LENGTH: 12,
  SALT_LENGTH: 16,
  ITERATIONS: 100000,
} as const;

interface EncryptionResult {
  encryptedData: string;
  iv: string;
  salt: string;
  algorithm: string;
}

interface DecryptionResult {
  decryptedData: string;
  success: boolean;
  error?: string;
}

interface EncryptionStats {
  totalEncryptions: number;
  totalDecryptions: number;
  encryptionErrors: number;
  decryptionErrors: number;
  averageEncryptionTime: number;
  averageDecryptionTime: number;
}

class EncryptionService {
  private static instance: EncryptionService;
  private masterKey: CryptoKey | null = null;
  private stats: EncryptionStats = {
    totalEncryptions: 0,
    totalDecryptions: 0,
    encryptionErrors: 0,
    decryptionErrors: 0,
    averageEncryptionTime: 0,
    averageDecryptionTime: 0,
  };

  private constructor() {
    this.initializeMasterKey();
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize master encryption key
   */
  private async initializeMasterKey(): Promise<void> {
    try {
      // In production, this should be stored securely (e.g., environment variables, KMS)
      // For browser environment, use a default key or get from window.__ENV__
      const masterKeyString =
        (typeof window !== "undefined" &&
          (window as any).__ENV__?.ENCRYPTION_MASTER_KEY) ||
        "default-master-key-for-development";

      this.masterKey = await this.deriveKey(masterKeyString);

      logger.info("Master encryption key initialized", "EncryptionService");
    } catch (error) {
      logger.error(
        "Failed to initialize master encryption key",
        "EncryptionService",
        error
      );
      throw new Error("Encryption service initialization failed");
    }
  }

  /**
   * Encrypt sensitive data
   */
  public async encryptData(
    data: string,
    context?: string
  ): Promise<EncryptionResult> {
    const startTime = Date.now();

    try {
      if (!this.masterKey) {
        throw new Error("Master key not initialized");
      }

      // Generate random IV and salt
      const iv = crypto.getRandomValues(
        new Uint8Array(ENCRYPTION_CONFIG.IV_LENGTH)
      );
      const salt = crypto.getRandomValues(
        new Uint8Array(ENCRYPTION_CONFIG.SALT_LENGTH)
      );

      // Convert data to ArrayBuffer
      const dataBuffer = new TextEncoder().encode(data);

      // Encrypt data
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: ENCRYPTION_CONFIG.ALGORITHM,
          iv: iv,
        },
        this.masterKey,
        dataBuffer
      );

      // Convert to base64 strings
      const encryptedData = this.arrayBufferToBase64(encryptedBuffer);
      const ivString = this.arrayBufferToBase64(iv);
      const saltString = this.arrayBufferToBase64(salt);

      const result: EncryptionResult = {
        encryptedData,
        iv: ivString,
        salt: saltString,
        algorithm: ENCRYPTION_CONFIG.ALGORITHM,
      };

      this.updateStats("encryption", Date.now() - startTime);

      logger.debug("Data encrypted successfully", "EncryptionService", {
        dataLength: data.length,
        context,
      });

      return result;
    } catch (error) {
      this.stats.encryptionErrors++;
      logger.error("Data encryption failed", "EncryptionService", error);
      throw new Error("Failed to encrypt data");
    }
  }

  /**
   * Decrypt sensitive data
   */
  public async decryptData(
    encryptedData: string,
    iv: string,
    salt: string,
    algorithm: string = ENCRYPTION_CONFIG.ALGORITHM
  ): Promise<DecryptionResult> {
    const startTime = Date.now();

    try {
      if (!this.masterKey) {
        throw new Error("Master key not initialized");
      }

      if (algorithm !== ENCRYPTION_CONFIG.ALGORITHM) {
        throw new Error("Unsupported encryption algorithm");
      }

      // Convert base64 strings to ArrayBuffer
      const encryptedBuffer = this.base64ToArrayBuffer(encryptedData);
      const ivBuffer = this.base64ToArrayBuffer(iv);

      // Decrypt data
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: algorithm,
          iv: ivBuffer,
        },
        this.masterKey,
        encryptedBuffer
      );

      // Convert to string
      const decryptedData = new TextDecoder().decode(decryptedBuffer);

      this.updateStats("decryption", Date.now() - startTime);

      logger.debug("Data decrypted successfully", "EncryptionService", {
        dataLength: decryptedData.length,
      });

      return {
        decryptedData,
        success: true,
      };
    } catch (error) {
      this.stats.decryptionErrors++;
      logger.error("Data decryption failed", "EncryptionService", error);

      return {
        decryptedData: "",
        success: false,
        error: error instanceof Error ? error.message : "Decryption failed",
      };
    }
  }

  /**
   * Encrypt conversation content
   */
  public async encryptConversationContent(
    content: string,
    conversationId: string
  ): Promise<EncryptionResult> {
    return this.encryptData(content, `conversation:${conversationId}`);
  }

  /**
   * Decrypt conversation content
   */
  public async decryptConversationContent(
    encryptedContent: string,
    iv: string,
    salt: string,
    conversationId: string
  ): Promise<DecryptionResult> {
    return this.decryptData(encryptedContent, iv, salt);
  }

  /**
   * Encrypt PII data (phone numbers, emails, etc.)
   */
  public async encryptPII(
    piiData: string,
    dataType: "phone" | "email" | "name"
  ): Promise<EncryptionResult> {
    return this.encryptData(piiData, `pii:${dataType}`);
  }

  /**
   * Decrypt PII data
   */
  public async decryptPII(
    encryptedPII: string,
    iv: string,
    salt: string,
    dataType: "phone" | "email" | "name"
  ): Promise<DecryptionResult> {
    return this.decryptData(encryptedPII, iv, salt);
  }

  /**
   * Encrypt message content
   */
  public async encryptMessageContent(
    content: string,
    messageId: string
  ): Promise<EncryptionResult> {
    return this.encryptData(content, `message:${messageId}`);
  }

  /**
   * Decrypt message content
   */
  public async decryptMessageContent(
    encryptedContent: string,
    iv: string,
    salt: string,
    messageId: string
  ): Promise<DecryptionResult> {
    return this.decryptData(encryptedContent, iv, salt);
  }

  /**
   * Hash sensitive data for comparison (one-way)
   */
  public async hashData(
    data: string,
    salt?: string
  ): Promise<{ hash: string; salt: string }> {
    try {
      const dataSalt =
        salt ||
        this.arrayBufferToBase64(
          crypto.getRandomValues(new Uint8Array(ENCRYPTION_CONFIG.SALT_LENGTH))
        );

      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data + dataSalt);

      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hash = this.arrayBufferToBase64(hashBuffer);

      return { hash, salt: dataSalt };
    } catch (error) {
      logger.error("Data hashing failed", "EncryptionService", error);
      throw new Error("Failed to hash data");
    }
  }

  /**
   * Verify hashed data
   */
  public async verifyHash(
    data: string,
    hash: string,
    salt: string
  ): Promise<boolean> {
    try {
      const { hash: computedHash } = await this.hashData(data, salt);
      return computedHash === hash;
    } catch (error) {
      logger.error("Hash verification failed", "EncryptionService", error);
      return false;
    }
  }

  /**
   * Derive encryption key from master key
   */
  private async deriveKey(masterKeyString: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(masterKeyString),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("owlai-encryption-salt"),
        iterations: ENCRYPTION_CONFIG.ITERATIONS,
        hash: "SHA-256",
      },
      keyMaterial,
      {
        name: ENCRYPTION_CONFIG.ALGORITHM,
        length: ENCRYPTION_CONFIG.KEY_LENGTH,
      },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Update encryption/decryption statistics
   */
  private updateStats(
    operation: "encryption" | "decryption",
    time: number
  ): void {
    if (operation === "encryption") {
      this.stats.totalEncryptions++;
      this.stats.averageEncryptionTime =
        (this.stats.averageEncryptionTime * (this.stats.totalEncryptions - 1) +
          time) /
        this.stats.totalEncryptions;
    } else {
      this.stats.totalDecryptions++;
      this.stats.averageDecryptionTime =
        (this.stats.averageDecryptionTime * (this.stats.totalDecryptions - 1) +
          time) /
        this.stats.totalDecryptions;
    }
  }

  /**
   * Get encryption statistics
   */
  public getEncryptionStats(): EncryptionStats {
    return { ...this.stats };
  }

  /**
   * Reset encryption statistics
   */
  public resetStats(): void {
    this.stats = {
      totalEncryptions: 0,
      totalDecryptions: 0,
      encryptionErrors: 0,
      decryptionErrors: 0,
      averageEncryptionTime: 0,
      averageDecryptionTime: 0,
    };
  }

  /**
   * Check if encryption service is ready
   */
  public isReady(): boolean {
    return this.masterKey !== null;
  }

  /**
   * Reinitialize master key (useful for key rotation)
   */
  public async reinitializeMasterKey(): Promise<void> {
    this.masterKey = null;
    await this.initializeMasterKey();
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();

// Export types
export type { EncryptionResult, DecryptionResult, EncryptionStats };
