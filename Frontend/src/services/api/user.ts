// User API service

import { apiClient } from "./client";
import { ApiResponse, User, PaginatedResponse } from "../../types";

export interface UpdateUserRequest {
  displayName?: string;
  photoURL?: string;
}

export const userApi = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>("/users/profile");
  },

  async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiClient.put<ApiResponse<User>>("/users/profile", data);
  },

  async deleteAccount(): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>("/users/account");
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.put<ApiResponse<void>>("/users/password", data);
  },

  async getUsers(page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    return apiClient.get<PaginatedResponse<User>>(
      `/users?page=${page}&limit=${limit}`
    );
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`/users/${id}`);
  },
};
