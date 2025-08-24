/**
 * Secure Storage Utility
 * Provides encrypted storage for sensitive data like tokens
 */

interface SecureStorageOptions {
  encryptionKey?: string;
  storage?: Storage;
}

class SecureStorage {
  private options: SecureStorageOptions;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(options: SecureStorageOptions = {}) {
    this.options = {
      storage:
        typeof window !== "undefined" ? window.sessionStorage : undefined,
      ...options,
    };
  }

  /**
   * Encrypt data before storage
   */
  private async encrypt(data: string): Promise<string> {
    if (!this.options.encryptionKey) {
      // Fallback to base64 encoding if no encryption key
      return btoa(data);
    }

    try {
      const key = await crypto.subtle.importKey(
        "raw",
        this.encoder.encode(this.options.encryptionKey),
        { name: "AES-GCM" },
        false,
        ["encrypt"]
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        this.encoder.encode(data)
      );

      const encryptedArray = new Uint8Array(encrypted);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error("Encryption failed, falling back to base64:", error);
      return btoa(data);
    }
  }

  /**
   * Decrypt data after retrieval
   */
  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.options.encryptionKey) {
      // Fallback to base64 decoding if no encryption key
      return atob(encryptedData);
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const key = await crypto.subtle.importKey(
        "raw",
        this.encoder.encode(this.options.encryptionKey),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encrypted
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error("Decryption failed, falling back to base64:", error);
      return atob(encryptedData);
    }
  }

  /**
   * Store sensitive data securely
   */
  async set(key: string, value: any): Promise<void> {
    if (!this.options.storage) return;

    try {
      const serialized = JSON.stringify(value);
      const encrypted = await this.encrypt(serialized);
      this.options.storage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error(`Failed to store secure data for key "${key}":`, error);
    }
  }

  /**
   * Retrieve sensitive data securely
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.options.storage) return null;

    try {
      const encrypted = this.options.storage.getItem(`secure_${key}`);
      if (!encrypted) return null;

      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error(`Failed to retrieve secure data for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove sensitive data
   */
  remove(key: string): void {
    if (!this.options.storage) return;

    try {
      this.options.storage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error(`Failed to remove secure data for key "${key}":`, error);
    }
  }

  /**
   * Clear all secure data
   */
  clear(): void {
    if (!this.options.storage) return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.options.storage.length; i++) {
        const key = this.options.storage.key(i);
        if (key && key.startsWith("secure_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => this.options.storage!.removeItem(key));
    } catch (error) {
      console.error("Failed to clear secure storage:", error);
    }
  }
}

// Create secure storage instance
export const secureStorage = new SecureStorage({
  encryptionKey: import.meta.env.VITE_STORAGE_ENCRYPTION_KEY,
});

export default SecureStorage;
