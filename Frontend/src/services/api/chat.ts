// Chat API service

import { apiClient } from "./client";
import {
  ApiResponse,
  ChatMessage,
  Conversation,
  PaginatedResponse,
} from "../../types";

export interface SendMessageRequest {
  content: string;
  conversationId?: string;
}

export interface CreateConversationRequest {
  title: string;
}

export const chatApi = {
  async sendMessage(
    data: SendMessageRequest
  ): Promise<ApiResponse<ChatMessage>> {
    return apiClient.post<ApiResponse<ChatMessage>>("/chat/messages", data);
  },

  async getConversations(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<Conversation>> {
    return apiClient.get<PaginatedResponse<Conversation>>(
      `/chat/conversations?page=${page}&limit=${limit}`
    );
  },

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<ApiResponse<Conversation>>(
      `/chat/conversations/${id}`
    );
  },

  async getMessages(
    conversationId: string,
    page = 1,
    limit = 50
  ): Promise<PaginatedResponse<ChatMessage>> {
    return apiClient.get<PaginatedResponse<ChatMessage>>(
      `/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
  },

  async createConversation(
    data: CreateConversationRequest
  ): Promise<ApiResponse<Conversation>> {
    return apiClient.post<ApiResponse<Conversation>>(
      "/chat/conversations",
      data
    );
  },

  async updateConversation(
    id: string,
    data: Partial<Conversation>
  ): Promise<ApiResponse<Conversation>> {
    return apiClient.put<ApiResponse<Conversation>>(
      `/chat/conversations/${id}`,
      data
    );
  },

  async deleteConversation(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/chat/conversations/${id}`);
  },

  async deleteMessage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/chat/messages/${id}`);
  },
};
