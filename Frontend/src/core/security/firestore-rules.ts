/**
 * Firestore Security Rules
 * Comprehensive security rules for data access control and validation
 */

// Firestore Security Rules Configuration
export const FIRESTORE_SECURITY_RULES = {
  // Collection access patterns
  COLLECTIONS: {
    USERS: "users",
    CONVERSATIONS: "conversations",
    MESSAGES: "messages",
    ANALYTICS: "analytics",
    AUDIT_LOGS: "audit_logs",
  },

  // Permission levels
  PERMISSIONS: {
    READ: "read",
    WRITE: "write",
    DELETE: "delete",
    ADMIN: "admin",
  },

  // Data validation patterns
  VALIDATION: {
    PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USER_ID_REGEX: /^[a-zA-Z0-9_-]{20,}$/,
  },
} as const;

// Security rule templates
export const SECURITY_RULE_TEMPLATES = {
  // User can only access their own data
  USER_OWNED_DATA: `
    // Users can only access their own data
    request.auth != null && 
    request.auth.uid == resource.data.user_id
  `,

  // User can only access their own conversations
  USER_CONVERSATIONS: `
    // Users can only access conversations they own
    request.auth != null && 
    request.auth.uid == resource.data.user_id &&
    request.auth.uid == request.resource.data.user_id
  `,

  // User can only access messages in their conversations
  USER_MESSAGES: `
    // Users can only access messages in their conversations
    request.auth != null && 
    exists(/databases/$(database.name)/documents/conversations/$(resource.data.conversation_id)) &&
    get(/databases/$(database.name)/documents/conversations/$(resource.data.conversation_id)).data.user_id == request.auth.uid
  `,

  // Phone number validation
  PHONE_VALIDATION: `
    // Phone number must be valid format
    request.resource.data.phone_number.matches('^\\\\+?[1-9]\\\\d{1,14}$')
  `,

  // Email validation
  EMAIL_VALIDATION: `
    // Email must be valid format
    request.resource.data.email.matches('^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$')
  `,

  // User ID validation
  USER_ID_VALIDATION: `
    // User ID must be valid format
    request.resource.data.user_id.matches('^[a-zA-Z0-9_-]{20,}$')
  `,

  // Timestamp validation
  TIMESTAMP_VALIDATION: `
    // Timestamps must be valid
    request.resource.data.created_at is timestamp &&
    request.resource.data.updated_at is timestamp &&
    request.resource.data.updated_at >= request.resource.data.created_at
  `,

  // Status validation
  STATUS_VALIDATION: `
    // Status must be valid enum
    request.resource.data.status in ['active', 'archived', 'deleted']
  `,

  // Role validation
  ROLE_VALIDATION: `
    // Role must be valid enum
    request.resource.data.role in ['user', 'assistant', 'system']
  `,

  // Message type validation
  MESSAGE_TYPE_VALIDATION: `
    // Message type must be valid enum
    request.resource.data.type in ['text', 'image', 'file', 'system', 'error']
  `,
} as const;

// Complete Firestore security rules
export const COMPLETE_FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidPhone(phone) {
      return phone.matches('^\\\\+?[1-9]\\\\d{1,14}$');
    }
    
    function isValidEmail(email) {
      return email.matches('^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$');
    }
    
    function isValidUserId(userId) {
      return userId.matches('^[a-zA-Z0-9_-]{20,}$');
    }
    
    function isValidTimestamp(timestamp) {
      return timestamp is timestamp;
    }
    
    function isValidStatus(status) {
      return status in ['active', 'archived', 'deleted'];
    }
    
    function isValidRole(role) {
      return role in ['user', 'assistant', 'system'];
    }
    
    function isValidMessageType(type) {
      return type in ['text', 'image', 'file', 'system', 'error'];
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
      allow create: if isAuthenticated() && 
        isOwner(userId) && 
        isValidPhone(resource.data.phone_number) &&
        isValidEmail(resource.data.email) &&
        isValidUserId(userId);
      allow update: if isAuthenticated() && 
        isOwner(userId) && 
        (isValidPhone(resource.data.phone_number) || resource.data.phone_number == null) &&
        (isValidEmail(resource.data.email) || resource.data.email == null);
      allow delete: if false; // Soft delete only
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.user_id);
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.user_id) &&
        isValidStatus(request.resource.data.status) &&
        isValidTimestamp(request.resource.data.created_at) &&
        isValidTimestamp(request.resource.data.updated_at);
      allow update: if isAuthenticated() && 
        isOwner(resource.data.user_id) &&
        isValidStatus(request.resource.data.status) &&
        isValidTimestamp(request.resource.data.updated_at);
      allow delete: if false; // Soft delete only
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read, write: if isAuthenticated() && 
        isOwner(resource.data.user_id) &&
        exists(/databases/$(database.name)/documents/conversations/$(resource.data.conversation_id)) &&
        get(/databases/$(database.name)/documents/conversations/$(resource.data.conversation_id)).data.user_id == request.auth.uid;
      allow create: if isAuthenticated() && 
        isOwner(request.resource.data.user_id) &&
        isValidRole(request.resource.data.role) &&
        isValidMessageType(request.resource.data.type) &&
        isValidTimestamp(request.resource.data.created_at) &&
        isValidTimestamp(request.resource.data.updated_at) &&
        exists(/databases/$(database.name)/documents/conversations/$(request.resource.data.conversation_id)) &&
        get(/databases/$(database.name)/documents/conversations/$(request.resource.data.conversation_id)).data.user_id == request.auth.uid;
      allow update: if isAuthenticated() && 
        isOwner(resource.data.user_id) &&
        isValidTimestamp(request.resource.data.updated_at);
      allow delete: if false; // Soft delete only
    }
    
    // Analytics collection (read-only for users)
    match /analytics/{analyticsId} {
      allow read: if isAuthenticated() && isOwner(resource.data.user_id);
      allow write: if false; // Only system can write analytics
    }
    
    // Audit logs collection (read-only for users)
    match /audit_logs/{logId} {
      allow read: if isAuthenticated() && isOwner(resource.data.user_id);
      allow write: if false; // Only system can write audit logs
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;

// Security rule validation functions
export const SECURITY_VALIDATORS = {
  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    return FIRESTORE_SECURITY_RULES.VALIDATION.PHONE_REGEX.test(phone);
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    return FIRESTORE_SECURITY_RULES.VALIDATION.EMAIL_REGEX.test(email);
  },

  /**
   * Validate user ID format
   */
  validateUserId(userId: string): boolean {
    return FIRESTORE_SECURITY_RULES.VALIDATION.USER_ID_REGEX.test(userId);
  },

  /**
   * Validate conversation ownership
   */
  validateConversationOwnership(
    userId: string,
    conversationUserId: string
  ): boolean {
    return userId === conversationUserId;
  },

  /**
   * Validate message ownership
   */
  validateMessageOwnership(userId: string, messageUserId: string): boolean {
    return userId === messageUserId;
  },

  /**
   * Validate data before write
   */
  validateDataBeforeWrite(
    data: any,
    userId: string
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!data.user_id) {
      errors.push("user_id is required");
    } else if (!this.validateUserId(data.user_id)) {
      errors.push("user_id format is invalid");
    }

    // Check ownership
    if (data.user_id && data.user_id !== userId) {
      errors.push("user_id must match authenticated user");
    }

    // Check phone number if present
    if (data.phone_number && !this.validatePhoneNumber(data.phone_number)) {
      errors.push("phone_number format is invalid");
    }

    // Check email if present
    if (data.email && !this.validateEmail(data.email)) {
      errors.push("email format is invalid");
    }

    // Check timestamps
    if (data.created_at && !(data.created_at instanceof Date)) {
      errors.push("created_at must be a valid timestamp");
    }

    if (data.updated_at && !(data.updated_at instanceof Date)) {
      errors.push("updated_at must be a valid timestamp");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Export types
export type SecurityRuleTemplate = keyof typeof SECURITY_RULE_TEMPLATES;
export type PermissionLevel =
  (typeof FIRESTORE_SECURITY_RULES.PERMISSIONS)[keyof typeof FIRESTORE_SECURITY_RULES.PERMISSIONS];
