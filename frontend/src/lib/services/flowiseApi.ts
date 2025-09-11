interface FlowiseResponse {
  text: string;
  sourceDocuments?: any[];
  chatHistory?: any[];
}

interface FlowiseApiConfig {
  endpoint: string;
  timeout?: number;
}

export class FlowiseApiService {
  private config: FlowiseApiConfig;

  constructor(config: FlowiseApiConfig) {
    this.config = {
      timeout: 30000, // 30 seconds default
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

  async query(question: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      // Create a friendly system prompt with the user's question
      const enhancedQuestion = this.createFriendlyPrompt(question);

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
      
      return result.text || "Oops! 😅 Kuch technical issue hai mere end mein. Please try again, main help karne ke liye ready hun!";
    } catch (error) {
      console.error('Flowise API Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return "Sorry yaar! 😔 Request thoda zyada time le raha tha. Koi baat nahi, please try again with a shorter question!";
        }
        
        if (error.message.includes('Failed to fetch')) {
          return "Hmm, connection mein kuch problem lag rahi hai! 🤔 Internet check kar lo aur fir try karna. Main yahan wait kar raha hun! 😊";
        }
      }
      
      return "Arre yaar, kuch technical glitch hua hai! 😓 No worries, just try again - main definitely help karunga! 💪";
    }
  }
}

// Default instance with your API endpoint
export const flowiseApi = new FlowiseApiService({
  endpoint: "http://34.47.134.139:3000/api/v1/prediction/07b180f1-3364-4771-ac29-76334af9e793"
});