# OwlAI Real-Time Chat Database Schema

## Overview
This document outlines the Firestore database schema for OwlAI's real-time chat system with user-specific sessions, message persistence, and AI integration.

## Collections Structure

### 1. Users Collection
**Path**: `/users/{userId}`

```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  onboardingProfile?: {
    examType: string;            // UGC-NET, CSIR-NET, etc.
    subjects: string[];
    studyLevel: string;
    goals: string[];
    preferredLanguage: string;
    studyHours: number;
    source: string;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoSave: boolean;
  };
  subscription: {
    plan: 'free' | 'premium';
    expiresAt?: Timestamp;
    features: string[];
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt: Timestamp;
}
```

### 2. Chat Sessions Collection
**Path**: `/users/{userId}/chatSessions/{sessionId}`

```typescript
interface ChatSession {
  id: string;                    // Auto-generated session ID
  userId: string;                // Reference to user
  title: string;                 // Auto-generated or user-defined
  description?: string;
  category: 'study' | 'practice' | 'general' | 'exam-prep';
  subject?: string;              // Related subject if applicable
  isPinned: boolean;
  isArchived: boolean;
  messageCount: number;          // Denormalized for quick access
  lastMessage: {
    content: string;
    sender: 'user' | 'ai';
    timestamp: Timestamp;
  };
  metadata: {
    flowiseSessionId?: string;   // For Flowise context continuity
    examContext?: string;        // Exam type context
    studyTopic?: string;         // Current study topic
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3. Messages Collection
**Path**: `/users/{userId}/chatSessions/{sessionId}/messages/{messageId}`

```typescript
interface Message {
  id: string;                    // Auto-generated message ID
  sessionId: string;             // Reference to chat session
  userId: string;                // Reference to user
  content: string;               // Message text content
  sender: 'user' | 'ai';
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
  
  // AI-specific fields
  aiMetadata?: {
    flowiseMessageId?: string;   // Flowise message reference
    processingTime?: number;     // Response time in ms
    model?: string;              // AI model used
    tokens?: {
      input: number;
      output: number;
    };
    confidence?: number;         // AI confidence score
    sources?: Array<{            // Source documents
      title: string;
      url?: string;
      relevance: number;
    }>;
  };
  
  // User interaction tracking
  interactions?: {
    copied: boolean;
    regenerated: boolean;
    feedback?: 'like' | 'dislike';
    feedbackReason?: string;
  };
  
  // Message threading
  parentMessageId?: string;      // For message regeneration
  threadId?: string;             // For conversation threading
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. User Activity Collection
**Path**: `/users/{userId}/activity/{activityId}`

```typescript
interface UserActivity {
  id: string;
  userId: string;
  type: 'session_created' | 'message_sent' | 'ai_response' | 'feedback_given';
  sessionId?: string;
  messageId?: string;
  metadata: Record<string, any>;
  timestamp: Timestamp;
}
```

### 5. System Analytics Collection
**Path**: `/analytics/{date}`

```typescript
interface DailyAnalytics {
  date: string;                  // YYYY-MM-DD format
  users: {
    active: number;
    new: number;
    returning: number;
  };
  sessions: {
    created: number;
    total: number;
    avgDuration: number;
  };
  messages: {
    user: number;
    ai: number;
    total: number;
  };
  performance: {
    avgResponseTime: number;
    errorRate: number;
  };
}
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Chat sessions are user-specific
      match /chatSessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        
        // Messages within sessions
        match /messages/{messageId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
      
      // User activity tracking
      match /activity/{activityId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Analytics - admin only
    match /analytics/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## Indexes Required

### Composite Indexes
1. **Chat Sessions by User and Update Time**
   - Collection: `users/{userId}/chatSessions`
   - Fields: `userId` (Ascending), `updatedAt` (Descending)
   - Query: Recent sessions for user

2. **Messages by Session and Timestamp**
   - Collection: `users/{userId}/chatSessions/{sessionId}/messages`
   - Fields: `sessionId` (Ascending), `createdAt` (Ascending)
   - Query: Chronological message loading

3. **Pinned Sessions**
   - Collection: `users/{userId}/chatSessions`
   - Fields: `userId` (Ascending), `isPinned` (Ascending), `updatedAt` (Descending)
   - Query: User's pinned sessions

4. **Messages by Status**
   - Collection: `users/{userId}/chatSessions/{sessionId}/messages`
   - Fields: `userId` (Ascending), `status` (Ascending), `createdAt` (Descending)
   - Query: Failed or pending messages

## Data Flow Architecture

### 1. User Authentication Flow
```
User Login → Firebase Auth → Create/Update User Document → Load User Preferences
```

### 2. Chat Session Flow
```
New Chat → Create Session Document → Generate Session ID → Initialize Message Collection
```

### 3. Message Flow
```
User Message → Save to Firestore → Send to Flowise → AI Response → Save AI Message → Update Session
```

### 4. Real-time Synchronization
```
Firestore Listeners → Real-time Updates → UI State Updates → Optimistic Updates
```

## Performance Considerations

### 1. Pagination Strategy
- Load messages in batches of 50
- Use cursor-based pagination with `createdAt` timestamp
- Implement infinite scroll for message history

### 2. Caching Strategy
- Cache recent sessions in local storage
- Cache user preferences and profile
- Implement offline-first approach with sync on reconnection

### 3. Optimization Techniques
- Denormalize frequently accessed data (message count, last message)
- Use subcollections for better query performance
- Implement message batching for bulk operations

### 4. Cost Optimization
- Limit message history to last 1000 messages per session
- Archive old sessions after 6 months
- Compress large message content

## Migration Strategy

### Phase 1: Basic Implementation
1. User authentication and profile management
2. Basic chat session creation and management
3. Message persistence and real-time sync

### Phase 2: Advanced Features
1. Message status tracking and delivery confirmation
2. Advanced search and filtering
3. Message threading and regeneration

### Phase 3: Analytics and Optimization
1. User activity tracking
2. Performance analytics
3. Advanced caching and offline support

This schema provides a robust foundation for OwlAI's real-time chat system with proper user isolation, scalable message storage, and comprehensive metadata tracking for AI interactions.