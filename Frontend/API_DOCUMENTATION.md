# OwlAI API Documentation

Comprehensive documentation for all API endpoints, services, and integrations used in the OwlAI application.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Core API Services](#core-api-services)
- [Firebase Services](#firebase-services)
- [Cloud Functions](#cloud-functions)
- [External Integrations](#external-integrations)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Overview

The OwlAI application uses a multi-layered API architecture:

- **Frontend API Client**: Handles HTTP requests and responses
- **Firebase Services**: Authentication, database, and cloud functions
- **External AI Services**: Flowise AI integration
- **Cloud Functions**: Server-side processing and background tasks

### Base URLs

```typescript
// Development
const API_BASE_URL = "http://localhost:3000";

// Production
const API_BASE_URL = "https://your-api-domain.com";

// Firebase Cloud Functions
const CLOUD_FUNCTIONS_URL =
  "https://us-central1-owlai-123456.cloudfunctions.net";

// Flowise AI
const FLOWISE_URL =
  "http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2";
```

## 🔐 Authentication

### Firebase Authentication

The application uses Firebase Authentication with phone number verification.

#### Authentication Flow

```typescript
// 1. Send verification code
POST /auth/send-verification
{
  "phoneNumber": "+1234567890"
}

// 2. Verify code and get token
POST /auth/verify-code
{
  "phoneNumber": "+1234567890",
  "verificationCode": "123456"
}

// 3. Response
{
  "success": true,
  "data": {
    "user": {
      "uid": "user_123",
      "phoneNumber": "+1234567890",
      "email": "user@example.com",
      "displayName": "John Doe"
    },
    "token": "firebase_jwt_token"
  }
}
```

#### Authentication Headers

```typescript
// Add to all authenticated requests
headers: {
  "Authorization": `Bearer ${firebaseToken}`,
  "Content-Type": "application/json"
}
```

## 🚀 Core API Services

### Chat API

#### Send Message

```typescript
POST /chat/messages
Content-Type: application/json
Authorization: Bearer <token>

{
  "session_id": "session_123",
  "message": "What is Teaching Aptitude?",
  "conversation_id": "conv_456"
}

// Response
{
  "success": true,
  "data": {
    "id": "msg_789",
    "role": "assistant",
    "content": "Teaching Aptitude refers to...",
    "timestamp": "2024-12-01T10:30:00Z",
    "conversation_id": "conv_456"
  }
}
```

#### Get Chat Sessions

```typescript
GET /chat/sessions?user_id=user_123&limit=20&offset=0
Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": "session_123",
      "title": "Teaching Aptitude Discussion",
      "user_id": "user_123",
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:30:00Z",
      "message_count": 5
    }
  ]
}
```

#### Create Chat Session

```typescript
POST /chat/sessions
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": "user_123",
  "title": "New Conversation"
}

// Response
{
  "success": true,
  "data": {
    "session_id": "session_456"
  }
}
```

#### Get Messages

```typescript
GET /chat/messages?session_id=session_123&limit=50&offset=0
Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": [
    {
      "id": "msg_123",
      "role": "user",
      "content": "What is Teaching Aptitude?",
      "timestamp": "2024-12-01T10:00:00Z",
      "conversation_id": "conv_456"
    },
    {
      "id": "msg_124",
      "role": "assistant",
      "content": "Teaching Aptitude refers to...",
      "timestamp": "2024-12-01T10:01:00Z",
      "conversation_id": "conv_456"
    }
  ]
}
```

### User API

#### Get User Profile

```typescript
GET /users/profile
Authorization: Bearer <token>

// Response
{
  "success": true,
  "data": {
    "uid": "user_123",
    "phoneNumber": "+1234567890",
    "email": "user@example.com",
    "displayName": "John Doe",
    "preferences": {
      "theme": "light",
      "notifications": true,
      "privacy_settings": {
        "data_sharing": false,
        "analytics": true
      }
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-12-01T10:00:00Z"
  }
}
```

#### Update User Profile

```typescript
PUT /users/profile
Content-Type: application/json
Authorization: Bearer <token>

{
  "displayName": "John Smith",
  "email": "john.smith@example.com",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}

// Response
{
  "success": true,
  "data": {
    "uid": "user_123",
    "displayName": "John Smith",
    "email": "john.smith@example.com",
    "updated_at": "2024-12-01T10:00:00Z"
  }
}
```

### Session API

#### Create User Session

```typescript
POST /session/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": "user_123"
}

// Response
{
  "success": true,
  "data": {
    "session_id": "session_789",
    "user_id": "user_123",
    "created_at": "2024-12-01T10:00:00Z"
  }
}
```

#### Initialize Anonymous Session

```typescript
POST /session/init-anon

// Response
{
  "success": true,
  "data": {
    "session_id": "anon_session_123",
    "user_id": "anon_user_456",
    "created_at": "2024-12-01T10:00:00Z"
  }
}
```

### Feedback API

#### Submit Feedback

```typescript
POST /feedback/submit
Content-Type: application/json
Authorization: Bearer <token>

{
  "message_id": "msg_123",
  "type": "like", // "like" | "dislike"
  "rating": 5, // 1-5 scale
  "comment": "Very helpful response!",
  "category": "teaching_aptitude"
}

// Response
{
  "success": true,
  "data": {
    "id": "feedback_789",
    "message_id": "msg_123",
    "type": "like",
    "rating": 5,
    "created_at": "2024-12-01T10:00:00Z"
  }
}
```

## 🔥 Firebase Services

### Firestore Database

#### Collections Structure

```typescript
// Users Collection
/users/{userId}
{
  uid: string;
  phoneNumber: string;
  email?: string;
  displayName?: string;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    privacy_settings: Record<string, boolean>;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Conversations Collection
/conversations/{conversationId}
{
  id: string;
  user_id: string;
  title: string;
  status: "active" | "archived" | "deleted";
  message_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Messages Collection
/messages/{messageId}
{
  id: string;
  conversation_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  type: "text" | "image" | "file" | "system" | "error";
  metadata?: {
    tokens_used?: number;
    model_used?: string;
    response_time?: number;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

#### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Conversations belong to users
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.user_id;
    }

    // Messages belong to conversations
    match /messages/{messageId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## ☁️ Cloud Functions

### AI Processing

#### Process AI Request

```typescript
POST /ai-processing
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "question": "What is Teaching Aptitude?",
    "conversationId": "conv_123",
    "userId": "user_456",
    "context": {
      "previousMessages": ["Previous message 1", "Previous message 2"],
      "userPreferences": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.7
      }
    }
  },
  "userId": "user_456",
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_789",
  "metadata": {
    "source": "client",
    "priority": "normal",
    "retryCount": 0
  }
}

// Response
{
  "success": true,
  "data": {
    "text": "Teaching Aptitude refers to...",
    "metadata": {
      "tokensUsed": 150,
      "modelUsed": "gpt-3.5-turbo",
      "responseTime": 2500,
      "cost": 0.003
    }
  }
}
```

#### Stream AI Response

```typescript
POST /ai-streaming
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "question": "What is Teaching Aptitude?",
    "conversationId": "conv_123",
    "userId": "user_456"
  },
  "userId": "user_456",
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_789"
}

// Streaming Response (Server-Sent Events)
data: {"chunk": "Teaching", "isComplete": false}
data: {"chunk": " Aptitude", "isComplete": false}
data: {"chunk": " refers", "isComplete": false}
data: {"chunk": " to...", "isComplete": true}
```

### Background Tasks

#### Conversation Summary

```typescript
POST /conversation-summary
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "conversationId": "conv_123",
    "userId": "user_456",
    "messageIds": ["msg_1", "msg_2", "msg_3"]
  },
  "userId": "user_456",
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_789"
}

// Response
{
  "success": true,
  "data": {
    "taskId": "task_123",
    "status": "processing",
    "estimatedTime": 30
  }
}
```

#### Message Archival

```typescript
POST /message-archival
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "conversationId": "conv_123",
    "userId": "user_456",
    "messageIds": ["msg_1", "msg_2", "msg_3"]
  },
  "userId": "user_456",
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_789"
}

// Response
{
  "success": true,
  "data": {
    "taskId": "task_456",
    "archivedCount": 3,
    "processingTime": 1500
  }
}
```

### Rate Limiting

#### Check Rate Limit

```typescript
POST /rate-limit-check
Content-Type: application/json
Authorization: Bearer <token>

{
  "data": {
    "userId": "user_456"
  },
  "userId": "user_456",
  "timestamp": "2024-12-01T10:00:00Z",
  "requestId": "req_789"
}

// Response
{
  "success": true,
  "data": {
    "allowed": true,
    "limitInfo": {
      "requestsPerMinute": 60,
      "requestsPerHour": 1000,
      "currentMinute": 15,
      "currentHour": 150,
      "resetTime": "2024-12-01T10:01:00Z"
    }
  }
}
```

## 🤖 External Integrations

### Flowise AI Service

#### Direct Integration

```typescript
POST http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2
Content-Type: application/json

{
  "question": "What is Teaching Aptitude?",
  "conversationId": "conv_123",
  "userId": "user_456",
  "context": {
    "previousMessages": ["Previous message 1", "Previous message 2"],
    "userPreferences": {
      "exam_type": "ugc_net",
      "subject": "teaching_aptitude"
    }
  }
}

// Response
{
  "text": "Teaching Aptitude refers to the natural ability and inclination...",
  "sourceDocuments": [
    {
      "title": "Teaching Aptitude Guide",
      "content": "Teaching aptitude encompasses...",
      "score": 0.95
    }
  ],
  "metadata": {
    "tokens_used": 150,
    "response_time": 2500,
    "model_used": "gpt-3.5-turbo",
    "timestamp": "2024-12-01T10:00:00Z"
  }
}
```

#### Configuration

```typescript
const FLOWISE_CONFIG = {
  BASE_URL:
    "http://34.47.149.141/api/v1/prediction/086aebf7-e250-41e6-b437-061f747041d2",
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

## ⚠️ Error Handling

### Error Response Format

```typescript
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 60,
      "current": 65,
      "resetTime": "2024-12-01T10:01:00Z"
    }
  },
  "timestamp": "2024-12-01T10:00:00Z"
}
```

### Common Error Codes

| Code                    | Message                   | Description                      |
| ----------------------- | ------------------------- | -------------------------------- |
| `AUTHENTICATION_FAILED` | Invalid or expired token  | Authentication error             |
| `RATE_LIMIT_EXCEEDED`   | Rate limit exceeded       | Too many requests                |
| `VALIDATION_ERROR`      | Invalid request data      | Request validation failed        |
| `RESOURCE_NOT_FOUND`    | Resource not found        | Requested resource doesn't exist |
| `PERMISSION_DENIED`     | Access denied             | Insufficient permissions         |
| `INTERNAL_ERROR`        | Internal server error     | Server-side error                |
| `NETWORK_ERROR`         | Network connection failed | Connection issues                |
| `TIMEOUT_ERROR`         | Request timeout           | Request took too long            |

### Error Handling in Code

```typescript
try {
  const response = await api.chat.sendMessage({
    session_id: "session_123",
    message: "What is Teaching Aptitude?",
  });

  console.log("Success:", response.data);
} catch (error) {
  if (error.code === "RATE_LIMIT_EXCEEDED") {
    // Handle rate limiting
    console.log("Rate limit exceeded, retry later");
  } else if (error.code === "AUTHENTICATION_FAILED") {
    // Handle authentication error
    console.log("Please login again");
  } else {
    // Handle other errors
    console.log("Error:", error.message);
  }
}
```

## 🚦 Rate Limiting

### Rate Limits

- **Anonymous Users**: 5 messages per session
- **Authenticated Users**: 60 requests per minute, 1000 per hour
- **Premium Users**: 120 requests per minute, 2000 per hour

### Rate Limit Headers

```typescript
// Response headers
{
  "X-RateLimit-Limit": "60",
  "X-RateLimit-Remaining": "45",
  "X-RateLimit-Reset": "2024-12-01T10:01:00Z"
}
```

### Rate Limit Checking

```typescript
// Check rate limit before making request
const rateLimitCheck = await api.rateLimit.check(userId);
if (!rateLimitCheck.allowed) {
  console.log("Rate limit exceeded, please wait");
  return;
}

// Make API request
const response = await api.chat.sendMessage(data);
```

## 📝 Examples

### Complete Chat Flow

```typescript
// 1. Authenticate user
const authResponse = await api.auth.login({
  phoneNumber: "+1234567890",
  verificationCode: "123456",
});

const { token, user } = authResponse.data;

// 2. Create chat session
const sessionResponse = await api.session.createUserSession(user.uid);
const { session_id } = sessionResponse.data;

// 3. Send message
const messageResponse = await api.chat.sendMessage({
  session_id,
  message: "What is Teaching Aptitude?",
});

const { content } = messageResponse.data;

// 4. Submit feedback
await api.feedback.submit({
  message_id: messageResponse.data.id,
  type: "like",
  rating: 5,
  comment: "Very helpful!",
});
```

### Error Handling Example

```typescript
async function sendMessageWithRetry(message: string, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await api.chat.sendMessage({
        session_id: "session_123",
        message,
      });
      return response.data;
    } catch (error) {
      if (error.code === "RATE_LIMIT_EXCEEDED") {
        const resetTime = new Date(error.details.resetTime);
        const waitTime = resetTime.getTime() - Date.now();
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (error.code === "NETWORK_ERROR" && attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error;
      }
    }
  }
}
```

### Streaming Response Example

```typescript
async function streamAIResponse(question: string) {
  const response = await fetch("/ai-streaming", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: { question, conversationId: "conv_123" },
    }),
  });

  const reader = response.body?.getReader();
  let fullResponse = "";

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = new TextDecoder().decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));
        fullResponse += data.chunk;

        // Update UI with streaming text
        updateUI(fullResponse);

        if (data.isComplete) {
          break;
        }
      }
    }
  }
}
```

---
