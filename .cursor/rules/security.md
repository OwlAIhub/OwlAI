# SECURITY RULES

# Comprehensive security guidelines for code generation and review

## R.A.I.L.G.U.A.R.D. SECURITY FRAMEWORK

### Risk First (R)

- Define security goals before code generation
- Identify specific risks being mitigated
- Never violate security intentions regardless of prompt ambiguity
- Always assume untrusted input and hostile environments

### Attached Constraints (A)

- Never hardcode secrets, API keys, passwords, or tokens
- Prohibit .env files in code or unknown tokens
- Never log sensitive data or session tokens
- Avoid unsafe functions like exec(), eval(), or innerHTML
- Always use environment variables for configuration

### Interpretative Framing (I)

- Apply secure credential handling even in "test" scenarios
- Interpret vague prompts with security-first assumptions
- Default to secure implementations over convenience
- Assume production environment unless explicitly stated otherwise

### Local Defaults (L)

- Use environment variables for all secrets and configuration
- Apply TLS/HTTPS by default for all communications
- Assume CORS should be restricted to specific origins
- Implement RBAC (Role-Based Access Control) for sensitive operations
- Use secure headers by default

### Generative Path Checks (G)

1. Check for input validation requirements
2. Assess risk level of operation
3. Apply appropriate sanitization and encoding
4. Verify authentication/authorization needs
5. Implement secure error handling without information disclosure

### Uncertainty Disclosure (U)

- Ask clarifying questions for ambiguous security requirements
- Never assume insecure defaults
- Flag potential security concerns in code comments
- Document security decisions and trade-offs

### Auditability (A)

- Include security reasoning in code comments
- Mark validated inputs with clear annotations
- Document security measures implemented
- Create audit trails for security-relevant operations

### Revision + Dialogue (R+D)

- Provide security decision explanations
- Enable security decision review process
- Support human-AI collaboration on security decisions
- Maintain security discussion context

## CRITICAL SECURITY PRINCIPLES

### NEVER ALLOW These in Generated Code

```typescript
// ❌ NEVER DO THESE
const API_KEY = 'sk-1234567890abcdef'; // Hardcoded secrets
const query = `SELECT * FROM users WHERE id = ${userId}`; // SQL injection
app.get('/files/*', (req, res) => res.sendFile(req.params[0])); // Path traversal
eval(userInput); // Code injection
document.innerHTML = userContent; // XSS vulnerability
process.exec(userCommand); // Command injection
Math.random().toString(36); // Weak randomness for security
```

### ALWAYS IMPLEMENT These Security Measures

```typescript
// ✅ ALWAYS DO THESE
const API_KEY = process.env.API_KEY; // Environment variables
const query = 'SELECT * FROM users WHERE id = $1'; // Parameterized queries
const sanitizedHtml = DOMPurify.sanitize(userContent); // Sanitization
crypto.randomBytes(32).toString('hex'); // Cryptographically secure random
```

## INPUT VALIDATION FRAMEWORK

### Comprehensive Input Validation

```typescript
import { z } from 'zod';
import DOMPurify from 'dompurify';
import validator from 'validator';

// Define strict validation schemas
const userRegistrationSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .refine(email => validator.isEmail(email), 'Invalid email'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),

  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  age: z
    .number()
    .int('Age must be an integer')
    .min(13, 'Must be at least 13 years old')
    .max(120, 'Invalid age'),

  phone: z
    .string()
    .optional()
    .refine(
      phone => !phone || validator.isMobilePhone(phone),
      'Invalid phone number'
    ),
});

// Input validation middleware
export const validateInput = <T>(schema: z.ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
      });

      // Attach validated data to request
      req.validated = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};

// Sanitization utilities
export const sanitizeInput = {
  html: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: [],
    });
  },

  sql: (input: string): string => {
    // Remove SQL injection patterns
    return input.replace(/['";\\]/g, '');
  },

  filename: (input: string): string => {
    // Remove path traversal and dangerous characters
    return input.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255);
  },

  url: (input: string): string => {
    try {
      const url = new URL(input);
      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('Invalid protocol');
      }
      return url.toString();
    } catch {
      throw new Error('Invalid URL');
    }
  },
};
```

### File Upload Security

```typescript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Secure file upload configuration
const secureFileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Store outside web root
      cb(null, process.env.UPLOAD_DIR || '/secure/uploads');
    },
    filename: (req, file, cb) => {
      // Generate secure random filename
      const randomName = crypto.randomBytes(16).toString('hex');
      const extension = path.extname(file.originalname).toLowerCase();
      cb(null, `${randomName}${extension}`);
    },
  }),

  fileFilter: (req, file, cb) => {
    // Whitelist allowed file types
    const allowedTypes = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.pdf',
      '.doc',
      '.docx',
    ];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5, // Maximum 5 files
  },
});

// File validation after upload
export const validateUploadedFile = async (filePath: string) => {
  const fileType = await import('file-type');
  const type = await fileType.fromFile(filePath);

  if (!type) {
    throw new Error('Could not determine file type');
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
  ];

  if (!allowedMimeTypes.includes(type.mime)) {
    throw new Error('File type not allowed');
  }

  return type;
};
```

## AUTHENTICATION & AUTHORIZATION

### JWT Security Implementation

```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Secure JWT configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'HS256' as const,
  issuer: process.env.APP_NAME || 'secure-app',
  audience: process.env.APP_DOMAIN || 'localhost',
};

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class AuthService {
  private static getSecretKey(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return secret;
  }

  private static getRefreshSecretKey(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
    }
    return secret;
  }

  static generateTokens(user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  }) {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    const accessToken = jwt.sign(payload, this.getSecretKey(), {
      expiresIn: JWT_CONFIG.accessTokenExpiry,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    });

    const refreshToken = jwt.sign(payload, this.getRefreshSecretKey(), {
      expiresIn: JWT_CONFIG.refreshTokenExpiry,
      algorithm: JWT_CONFIG.algorithm,
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    });

    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.getSecretKey(), {
        algorithms: [JWT_CONFIG.algorithm],
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.getRefreshSecretKey(), {
        algorithms: [JWT_CONFIG.algorithm],
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience,
      }) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}

// Authentication middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const token = authHeader.substring(7);
    const payload = AuthService.verifyAccessToken(token);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive',
      });
    }

    // Attach user info to request
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

// Authorization middleware
export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const hasPermission = requiredPermissions.some(
      permission =>
        req.user.permissions.includes(permission) || req.user.role === 'admin'
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};
```

### Session Security

```typescript
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Secure session configuration
export const sessionConfig = session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex'),
  name: 'sessionId', // Don't use default name
  resave: false,
  saveUninitialized: false,
  rolling: true, // Extend session on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
    sameSite: 'strict', // CSRF protection
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    touchAfter: 24 * 3600, // Lazy session update
    crypto: {
      secret: process.env.SESSION_ENCRYPTION_KEY,
    },
  }),
});
```

## DATABASE SECURITY

### SQL Injection Prevention

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ ALWAYS USE: Parameterized queries with Prisma
export const getUserSecurely = async (userId: string, email?: string) => {
  return prisma.user.findFirst({
    where: {
      AND: [
        { id: userId }, // Automatically parameterized
        email ? { email: email } : {},
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      // Never select password or sensitive fields
    },
  });
};

// ✅ Safe raw queries when needed
export const getCustomReportSecurely = async (
  status: string,
  limit: number
) => {
  // Validate inputs first
  if (!['active', 'inactive', 'pending'].includes(status)) {
    throw new Error('Invalid status value');
  }

  if (limit > 1000 || limit < 1) {
    throw new Error('Invalid limit value');
  }

  return prisma.$queryRaw`
    SELECT id, name, email, status
    FROM users
    WHERE status = ${status}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
};

// ❌ NEVER DO: String concatenation
// const query = `SELECT * FROM users WHERE id = ${userId}`; // VULNERABLE!
```

### Database Connection Security

```typescript
// Secure database configuration
const databaseConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: true,
          ca: process.env.DB_SSL_CA,
          cert: process.env.DB_SSL_CERT,
          key: process.env.DB_SSL_KEY,
        }
      : false,
  pool: {
    min: 2,
    max: 10,
    idle: 10000,
    acquire: 30000,
  },
  logging: process.env.NODE_ENV === 'development',
};
```

## API SECURITY

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Different rate limits for different endpoints
export const rateLimiters = {
  // Strict rate limiting for authentication endpoints
  auth: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      success: false,
      message: 'Too many authentication attempts, please try again later',
      retryAfter: 15 * 60, // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Rate limit exceeded',
        retryAfter: Math.round(15 * 60),
      });
    },
  }),

  // General API rate limiting
  api: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      success: false,
      message: 'API rate limit exceeded',
    },
  }),

  // Strict rate limiting for file uploads
  upload: rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.call(...args),
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: {
      success: false,
      message: 'Upload rate limit exceeded',
    },
  }),
};
```

### CORS Security

```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-CSRF-Token',
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours for preflight caching
};

export const corsMiddleware = cors(corsOptions);
```

### Security Headers

```typescript
import helmet from 'helmet';

export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Only if absolutely necessary
        'https://cdn.jsdelivr.net',
        'https://unpkg.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: [
        "'self'",
        'https://api.yourapp.com',
        process.env.NODE_ENV === 'development' ? 'http://localhost:*' : '',
      ].filter(Boolean),
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },

  // Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Prevent MIME type sniffing
  noSniff: true,

  // Prevent clickjacking
  frameguard: { action: 'deny' },

  // Hide powered by header
  hidePoweredBy: true,

  // Prevent XSS
  xssFilter: true,
});

// Additional security headers
export const additionalSecurityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Prevent caching of sensitive content
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  next();
};
```

## FRONTEND SECURITY

### XSS Prevention

```typescript
import DOMPurify from 'dompurify';

// Safe HTML rendering
export const SafeHTML: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
};

// Safe link component
export const SafeLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => {
  const isExternalLink = href.startsWith('http') && !href.includes(window.location.hostname);

  return (
    <a
      href={href}
      target={isExternalLink ? '_blank' : '_self'}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
      onClick={(e) => {
        // Validate URL before navigation
        try {
          new URL(href);
        } catch {
          e.preventDefault();
          console.error('Invalid URL:', href);
        }
      }}
    >
      {children}
    </a>
  );
};

// Content Security Policy for React apps
export const CSPMeta: React.FC = () => (
  <meta
    httpEquiv="Content-Security-Policy"
    content={`
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' ${process.env.REACT_APP_API_URL};
    `.replace(/\s+/g, ' ').trim()}
  />
);
```

## SECURITY MONITORING

### Security Event Logging

```typescript
interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: Date;
}

export class SecurityLogger {
  private static logSecurityEvent(event: SecurityEvent) {
    const logEntry = {
      ...event,
      timestamp: event.timestamp.toISOString(),
      level: 'SECURITY',
    };

    // Log to file/database/monitoring service
    console.log(JSON.stringify(logEntry));

    // Send alerts for high/critical severity
    if (['high', 'critical'].includes(event.severity)) {
      this.sendSecurityAlert(event);
    }
  }

  private static async sendSecurityAlert(event: SecurityEvent) {
    // Send to monitoring service (e.g., Slack, email, PagerDuty)
    // Implementation depends on your monitoring setup
  }

  static logFailedLogin(email: string, ip: string, userAgent: string) {
    this.logSecurityEvent({
      type: 'FAILED_LOGIN',
      severity: 'medium',
      ip,
      userAgent,
      details: { email },
      timestamp: new Date(),
    });
  }

  static logSuspiciousActivity(
    type: string,
    userId: string,
    ip: string,
    userAgent: string,
    details: Record<string, any>
  ) {
    this.logSecurityEvent({
      type: `SUSPICIOUS_${type.toUpperCase()}`,
      severity: 'high',
      userId,
      ip,
      userAgent,
      details,
      timestamp: new Date(),
    });
  }

  static logDataAccess(
    userId: string,
    resource: string,
    action: string,
    ip: string,
    userAgent: string
  ) {
    this.logSecurityEvent({
      type: 'DATA_ACCESS',
      severity: 'low',
      userId,
      ip,
      userAgent,
      details: { resource, action },
      timestamp: new Date(),
    });
  }
}

// Security monitoring middleware
export const securityMonitoring = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Monitor for suspicious patterns
  const suspiciousPatterns = [
    /union.*select/i,
    /<script/i,
    /\.\.\/\.\.\//,
    /eval\s*\(/i,
  ];

  const requestBody = JSON.stringify(req.body);
  const queryString = req.url;

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(requestBody) || pattern.test(queryString)) {
      SecurityLogger.logSuspiciousActivity(
        'MALICIOUS_INPUT',
        req.user?.userId || 'anonymous',
        req.ip,
        req.get('User-Agent') || '',
        {
          url: req.url,
          method: req.method,
          pattern: pattern.toString(),
        }
      );
    }
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log slow requests (potential DoS)
    if (duration > 5000) {
      SecurityLogger.logSuspiciousActivity(
        'SLOW_REQUEST',
        req.user?.userId || 'anonymous',
        req.ip,
        req.get('User-Agent') || '',
        {
          url: req.url,
          method: req.method,
          duration,
        }
      );
    }
  });

  next();
};
```

## CODE GENERATION SECURITY RULES

### Mandatory Security Checklist for All Generated Code

When generating ANY code, ALWAYS ensure:

1. **Input Validation**: All user inputs are validated and sanitized
2. **Output Encoding**: All dynamic content is properly encoded
3. **Authentication**: Protected resources require proper authentication
4. **Authorization**: Users can only access resources they're permitted to
5. **Error Handling**: Errors don't leak sensitive information
6. **Logging**: Security-relevant events are logged
7. **HTTPS**: All communications use secure protocols
8. **Secrets Management**: No hardcoded secrets or credentials
9. **SQL Safety**: All database queries use parameterization
10. **XSS Prevention**: All HTML output is sanitized

### Security Code Generation Prompts

Use these prompts to ensure secure code generation:

- "Generate this component with WCAG 2.1 AA compliance and XSS protection"
- "Create this API endpoint with proper input validation and rate limiting"
- "Build this authentication flow with secure session management"
- "Implement this database query with SQL injection prevention"
- "Add proper error handling that doesn't expose sensitive information"
- "Include security logging for this sensitive operation"
- "Ensure this form has CSRF protection and input sanitization"
- "Add proper authorization checks for this protected resource"

### Security Review Checklist

Before deploying generated code, verify:

- [ ] All inputs are validated and sanitized
- [ ] All outputs are properly encoded
- [ ] Authentication is implemented where needed
- [ ] Authorization checks are in place
- [ ] Error messages don't leak information
- [ ] Security events are logged
- [ ] No hardcoded secrets or credentials
- [ ] Database queries use parameterization
- [ ] HTTPS is enforced
- [ ] Security headers are configured
