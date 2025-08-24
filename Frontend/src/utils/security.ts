/**
 * Security Utilities
 * Provides rate limiting, CSRF protection, and other security measures
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> =
    new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  isAllowed(identifier: string): boolean {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(identifier)
      : identifier;
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(identifier)
      : identifier;
    const record = this.requests.get(key);

    if (!record || Date.now() > record.resetTime) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - record.count);
  }

  reset(identifier: string): void {
    const key = this.config.keyGenerator
      ? this.config.keyGenerator(identifier)
      : identifier;
    this.requests.delete(key);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create rate limiters for different operations
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const messageRateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute
});

/**
 * CSRF Token Management
 */
class CSRFProtection {
  private tokens: Set<string> = new Set();

  generateToken(): string {
    const token = crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, "0"), "");
    this.tokens.add(token);
    return token;
  }

  validateToken(token: string): boolean {
    const isValid = this.tokens.has(token);
    if (isValid) {
      this.tokens.delete(token); // Use once
    }
    return isValid;
  }

  cleanup(): void {
    // Clean up old tokens periodically
    this.tokens.clear();
  }
}

export const csrfProtection = new CSRFProtection();

/**
 * Input Sanitization for XSS Prevention
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/data:/gi, "") // Remove data: protocol
    .replace(/vbscript:/gi, "") // Remove vbscript: protocol
    .replace(/expression\(/gi, "") // Remove CSS expressions
    .replace(/url\(/gi, "") // Remove CSS url()
    .trim();
}

/**
 * Secure Random String Generator
 */
export function generateSecureToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Secure Hash Function (for non-sensitive data)
 */
export async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Secure Comparison (timing attack resistant)
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validate URL for safe navigation
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedProtocols = ["http:", "https:"];
    const allowedDomains = [
      "ugc-net-api-202604444478.asia-south1.run.app",
      "firestore.googleapis.com",
      "identitytoolkit.googleapis.com",
      "securetoken.googleapis.com",
    ];

    return (
      allowedProtocols.includes(parsed.protocol) &&
      allowedDomains.some((domain) => parsed.hostname === domain)
    );
  } catch {
    return false;
  }
}

/**
 * Security Headers Helper
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  };
}

// Cleanup old data periodically
setInterval(() => {
  apiRateLimiter.cleanup();
  authRateLimiter.cleanup();
  messageRateLimiter.cleanup();
  csrfProtection.cleanup();
}, 30 * 60 * 1000); // Every 30 minutes
