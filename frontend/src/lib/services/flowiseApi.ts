interface FlowiseResponse {
  text: string;
  sourceDocuments?: any[];
  chatHistory?: any[];
}

interface FlowiseApiConfig {
  endpoint: string;
  timeout?: number;
  maxRetries?: number;
  cacheEnabled?: boolean;
}

interface CachedResponse {
  response: string;
  timestamp: number;
  expiresAt: number;
}

export class FlowiseApiService {
  private config: FlowiseApiConfig;
  private cache: Map<string, CachedResponse> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Prevent memory bloat

  constructor(config: FlowiseApiConfig) {
    this.config = {
      timeout: 30000, // 30 seconds default
      maxRetries: 3,
      cacheEnabled: true,
      ...config
    };
  }

  private createFriendlyPrompt(userQuestion: string): string {
    return `You are OwlAI, a friendly and helpful study companion for UGC NET Paper-1 students! 🦉

Your personality:
- Be warm, encouraging, and supportive
- Use a conversational and approachable tone
- Be liberal and flexible in your responses
- Make learning fun and engaging
- Use emojis occasionally to be friendly

Language Rules:
- Detect the user's language from their question
- If they ask in English, respond in English
- If they ask in Hinglish (Hindi-English mix), respond in Hinglish
- If they ask in Hindi, respond in Hinglish for better understanding
- Be natural and conversational in your language choice

Content Focus:
- Focus on UGC NET Paper-1 (Units 1-4): Teaching Aptitude, Research Aptitude, Comprehension, and Communication
- Give clear explanations with examples
- Provide practical tips and study strategies
- Include practice questions when helpful
- Be encouraging about their learning journey

User's Question: "${userQuestion}"

Please provide a helpful, friendly response in the appropriate language!`;
  }

  private getCacheKey(question: string): string {
    // Normalize question for consistent caching
    return question.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  private getCachedResponse(cacheKey: string): string | null {
    if (!this.config.cacheEnabled) return null;

    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.response;
  }

  private setCachedResponse(cacheKey: string, response: string): void {
    if (!this.config.cacheEnabled) return;

    // Implement LRU-like cache eviction
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    });
  }

  private async makeApiRequest(question: string, attempt: number = 1): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Optimized: shorter system prompt to save tokens
      const enhancedQuestion = `You're OwlAI 🦉, a UGC NET study buddy. Be friendly, use English/Hinglish as needed. Question: "${question}"`;

      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: enhancedQuestion }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const result: FlowiseResponse = await response.json();
      return result.text || "Oops! 😅 Kuch technical issue hai mere end mein. Please try again!";

    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic for production reliability
      if (attempt < (this.config.maxRetries || 3)) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.makeApiRequest(question, attempt + 1);
      }

      throw error;
    }
  }

  async query(question: string): Promise<string> {
    try {
      // Check cache first - MASSIVE performance gain
      const cacheKey = this.getCacheKey(question);
      const cachedResponse = this.getCachedResponse(cacheKey);
      
      if (cachedResponse) {
        return cachedResponse; // ⚡ Instant response, no API cost!
      }

      // Make API request with retry logic
      const response = await this.makeApiRequest(question);
      
      // Cache successful response
      this.setCachedResponse(cacheKey, response);
      
      return response;

    } catch (error) {
      console.error('Flowise API Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return "Sorry yaar! 😔 Request thoda zyada time le raha tha. Koi baat nahi, please try again!";
        }
        
        if (error.message.includes('Failed to fetch')) {
          return "Hmm, connection mein kuch problem lag rahi hai! 🤔 Internet check kar lo aur fir try karna.";
        }
      }
      
      return "Arre yaar, kuch technical glitch hua hai! 😓 No worries, just try again - main definitely help karunga! 💪";
    }
  }
}

// Production-grade configuration using environment variables
const getApiEndpoint = (): string => {
  // Try multiple environment variable names for flexibility
  const endpoint = 
    process.env.NEXT_PUBLIC_FLOWISE_API_ENDPOINT ||
    process.env.FLOWISE_API_ENDPOINT ||
    process.env.NEXT_PUBLIC_API_ENDPOINT;
  
  if (!endpoint) {
    console.error('🚨 FLOWISE API ENDPOINT NOT CONFIGURED! Set NEXT_PUBLIC_FLOWISE_API_ENDPOINT environment variable.');
    // Fallback for development only - NOT for production!
    return process.env.NODE_ENV === 'development' 
      ? "http://34.47.134.139:3000/api/v1/prediction/07b180f1-3364-4771-ac29-76334af9e793"
      : "";
  }
  
  return endpoint;
};

// Production-ready API instance with environment-based configuration
export const flowiseApi = new FlowiseApiService({
  endpoint: getApiEndpoint(),
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000"),
  maxRetries: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || "3"),
  cacheEnabled: process.env.NEXT_PUBLIC_API_CACHE_ENABLED !== "false" // Default to true
});