/**
 * Flowise API Service
 * Handles communication with the Flowise chatbot API
 */

// API Configuration
const FLOWISE_API_URL =
  "https://34.47.149.141/api/v1/prediction/79dcfd80-c276-4143-b9fd-07bde03d96de";

// Type definitions
export interface FlowiseRequest {
  question: string;
  chatId?: string;
  overrideConfig?: Record<string, unknown>;
}

export interface FlowiseResponse {
  text?: string;
  sourceDocuments?: Record<string, unknown>[];
  chatMessageId?: string;
  chatId?: string;
  error?: string;
}

export class FlowiseError extends Error {
  status?: number;
  code?: string;

  constructor(options: { message: string; status?: number; code?: string }) {
    super(options.message);
    this.name = "FlowiseError";
    this.status = options.status;
    this.code = options.code;
  }
}

/**
 * Main query function to communicate with Flowise API
 * @param data - The request data containing the question and optional parameters
 * @returns Promise<FlowiseResponse> - The API response
 */
export async function query(data: FlowiseRequest): Promise<FlowiseResponse> {
  try {
    // Validate input
    if (!data.question || typeof data.question !== "string") {
      throw new Error("Question is required and must be a string");
    }

    if (data.question.trim().length === 0) {
      throw new Error("Question cannot be empty");
    }

    // Make API request
    const response = await fetch(FLOWISE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if response is ok
    if (!response.ok) {
      throw new FlowiseError({
        message: `API request failed: ${response.status} ${response.statusText}`,
        status: response.status,
        code: "API_ERROR",
      });
    }

    // Parse JSON response
    const result: FlowiseResponse = await response.json();

    // Validate response structure
    if (!result || typeof result !== "object") {
      throw new Error("Invalid response format from API");
    }

    // Check for API-level errors
    if (result.error) {
      throw new Error(`API Error: ${result.error}`);
    }

    return result;
  } catch (error) {
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new FlowiseError({
        message: "Network error: Unable to connect to the API",
        code: "NETWORK_ERROR",
      });
    }

    if (error instanceof SyntaxError) {
      throw new FlowiseError({
        message: "Invalid response format from API",
        code: "PARSE_ERROR",
      });
    }

    // Re-throw FlowiseError as-is
    if (error instanceof Error && "status" in error) {
      throw error;
    }

    // Wrap other errors
    throw new FlowiseError({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      code: "UNKNOWN_ERROR",
    });
  }
}

/**
 * Send a chat message to Flowise
 * @param question - The user's question/message
 * @param chatId - Optional chat ID for conversation continuity
 * @returns Promise<FlowiseResponse> - The AI response
 */
export async function sendMessage(
  question: string,
  chatId?: string,
): Promise<FlowiseResponse> {
  const requestData: FlowiseRequest = {
    question: question.trim(),
  };

  if (chatId) {
    requestData.chatId = chatId;
  }

  return query(requestData);
}

/**
 * Test the API connection
 * @returns Promise<boolean> - True if API is working, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await query({ question: "Hello, are you working?" });
    return !!response && (!!response.text || !!response.chatMessageId);
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
}

/**
 * Get API health status
 * @returns Promise<{status: string, message: string}> - Health status
 */
export async function getApiHealth(): Promise<{
  status: string;
  message: string;
}> {
  try {
    const isWorking = await testConnection();
    return {
      status: isWorking ? "healthy" : "unhealthy",
      message: isWorking
        ? "API is responding correctly"
        : "API is not responding",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Export the main query function as default
export default query;
