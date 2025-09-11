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

  async query(question: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const result: FlowiseResponse = await response.json();
      
      return result.text || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Flowise API Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return "I apologize, but the request timed out. Please try asking a shorter question or try again later.";
        }
        
        if (error.message.includes('Failed to fetch')) {
          return "I'm having trouble connecting right now. Please check your internet connection and try again.";
        }
      }
      
      return "I encountered an error while processing your question. Please try again in a moment.";
    }
  }
}

// Default instance with your API endpoint
export const flowiseApi = new FlowiseApiService({
  endpoint: "http://34.47.134.139:3000/api/v1/prediction/07b180f1-3364-4771-ac29-76334af9e793"
});