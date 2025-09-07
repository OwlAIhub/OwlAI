import { FlowiseAPIError, flowiseAPI } from '@/lib/services/flowise-api';
import { useCallback, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  error?: boolean;
}

export interface UseFlowiseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useFlowiseChat(): UseFlowiseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessageRef = useRef<string>('');

  const addMessage = useCallback(
    (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      const newMessage: ChatMessage = {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    },
    []
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      // Clear any previous errors
      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      lastUserMessageRef.current = message.trim();

      try {
        // Prepare conversation history for context
        const history = messages
          .filter(msg => !msg.error)
          .slice(-10) // Last 10 messages for context
          .map(msg => ({
            type:
              msg.type === 'user'
                ? ('userMessage' as const)
                : ('apiMessage' as const),
            message: msg.content,
          }));

        // Check if this is a demo request
        if (
          message.trim().toLowerCase().includes('demo of formatted response') ||
          message.trim().toLowerCase().includes('test markdown')
        ) {
          // Add demo response with markdown formatting
          addMessage({
            type: 'bot',
            content: `# 🎨 Beautiful Markdown Response Demo

## 📋 Here's how your chatbot responses will look:

### ✨ **Structured Content**
Your LLM responses can now include:

1. **Headings** - Like this one!
2. **Numbered lists** - For step-by-step guides
3. **Bulleted lists** - For key points
4. **Code blocks** - For examples

### 💻 Code Example
\`\`\`typescript
const greetUser = (name: string) => {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to OwlAI, \${name}!\`;
};

// Usage
const message = greetUser("Student");
\`\`\`

### 📊 Data Tables
| Feature | Status | Priority |
|---------|--------|----------|
| Markdown Rendering | ✅ Complete | High |
| Code Highlighting | ✅ Complete | High |
| Tables | ✅ Complete | Medium |
| Lists | ✅ Complete | Medium |

### 🎯 Key Benefits
- **Better readability** - Structured content is easier to scan
- **Professional appearance** - Looks like high-quality documentation
- **Interactive elements** - Tables, code blocks, and formatted text
- **Consistent styling** - All responses follow the same design system

---

> 💡 **Pro Tip**: Your Flowise chatbot can now output markdown-formatted responses that will render beautifully in the UI!

**Ready to test?** Try asking about UGC NET topics and see how the responses are formatted! 🚀`,
          });
          return;
        }

        // Call Flowise API
        const response = await flowiseAPI.queryWithRetry({
          question: message.trim(),
          history,
        });

        // Add bot response with markdown formatting
        addMessage({
          type: 'bot',
          content: response.text,
        });
      } catch (error) {
        console.error('Flowise API Error:', error);

        let errorMessage = 'Sorry, I encountered an error. Please try again.';

        if (error instanceof FlowiseAPIError) {
          if (error.status === 429) {
            errorMessage =
              'Too many requests. Please wait a moment and try again.';
          } else if (error.status && error.status >= 500) {
            errorMessage =
              'Service temporarily unavailable. Please try again later.';
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
          }
        }

        // Add error message
        addMessage({
          type: 'bot',
          content: errorMessage,
          error: true,
        });

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, addMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    lastUserMessageRef.current = '';
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessageRef.current && !isLoading) {
      // Remove the last user message and any error response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.error);
        return filtered.slice(0, -1); // Remove last message (user message)
      });

      // Retry the last message
      await sendMessage(lastUserMessageRef.current);
    }
  }, [isLoading, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    retryLastMessage,
  };
}
