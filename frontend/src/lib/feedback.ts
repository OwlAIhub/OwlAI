export interface FeedbackData {
  messageId: string;
  chatId: string;
  feedback: 'up' | 'down';
  reason?: string;
  messageText?: string;
}

export async function submitFeedback(data: FeedbackData): Promise<boolean> {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch {
    return false;
  }
}

export async function getFeedbackStats(chatId?: string): Promise<{
  total: number;
  positive: number;
  negative: number;
  positiveRate: number;
}> {
  try {
    const params = new URLSearchParams();
    if (chatId) params.append('chatId', chatId);

    const response = await fetch(`/api/feedback/stats?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch {
    return {
      total: 0,
      positive: 0,
      negative: 0,
      positiveRate: 0,
    };
  }
}
