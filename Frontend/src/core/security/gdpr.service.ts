/**
 * GDPR Compliance Service
 * Handles user data deletion, export functionality, and privacy rights management
 */

import { logger } from "../../shared/utils/logger";
import { messageService } from "../database/services/message.service";
import { conversationService } from "../database/services/conversation.service";
import { encryptionService } from "./encryption.service";

interface GDPRRequest {
  userId: string;
  requestType: "export" | "deletion" | "rectification" | "portability";
  dataTypes: string[];
  reason?: string;
  timestamp: string;
  status: "pending" | "processing" | "completed" | "failed";
}

interface DataExport {
  userId: string;
  exportId: string;
  data: {
    conversations: any[];
    messages: any[];
    userProfile: any;
    analytics: any[];
  };
  metadata: {
    exportDate: string;
    dataTypes: string[];
    recordCount: number;
    fileSize: number;
  };
}

interface DeletionConfirmation {
  userId: string;
  deletionId: string;
  deletedData: {
    conversations: number;
    messages: number;
    analytics: number;
  };
  metadata: {
    deletionDate: string;
    retentionPeriod: number;
    anonymized: boolean;
  };
}

interface GDPRStats {
  totalRequests: number;
  exportRequests: number;
  deletionRequests: number;
  averageProcessingTime: number;
  successRate: number;
}

class GDPRService {
  private static instance: GDPRService;
  private requests: Map<string, GDPRRequest> = new Map();
  private stats: GDPRStats = {
    totalRequests: 0,
    exportRequests: 0,
    deletionRequests: 0,
    averageProcessingTime: 0,
    successRate: 0,
  };

  private constructor() {}

  public static getInstance(): GDPRService {
    if (!GDPRService.instance) {
      GDPRService.instance = new GDPRService();
    }
    return GDPRService.instance;
  }

  /**
   * Request data export (Right to Data Portability)
   */
  public async requestDataExport(
    userId: string,
    dataTypes: string[] = ["conversations", "messages", "profile", "analytics"]
  ): Promise<{ requestId: string; estimatedTime: number }> {
    const requestId = this.generateRequestId("export", userId);
    const timestamp = new Date().toISOString();

    const request: GDPRRequest = {
      userId,
      requestType: "export",
      dataTypes,
      timestamp,
      status: "pending",
    };

    this.requests.set(requestId, request);
    this.stats.totalRequests++;
    this.stats.exportRequests++;

    logger.info("GDPR data export requested", "GDPRService", {
      requestId,
      userId,
      dataTypes,
    });

    // Process export asynchronously
    this.processDataExport(requestId).catch(error => {
      logger.error("Data export processing failed", "GDPRService", error);
    });

    return {
      requestId,
      estimatedTime: this.calculateEstimatedTime(dataTypes),
    };
  }

  /**
   * Request data deletion (Right to be Forgotten)
   */
  public async requestDataDeletion(
    userId: string,
    reason?: string
  ): Promise<{ requestId: string; estimatedTime: number }> {
    const requestId = this.generateRequestId("deletion", userId);
    const timestamp = new Date().toISOString();

    const request: GDPRRequest = {
      userId,
      requestType: "deletion",
      dataTypes: ["all"],
      reason,
      timestamp,
      status: "pending",
    };

    this.requests.set(requestId, request);
    this.stats.totalRequests++;
    this.stats.deletionRequests++;

    logger.info("GDPR data deletion requested", "GDPRService", {
      requestId,
      userId,
      reason,
    });

    // Process deletion asynchronously
    this.processDataDeletion(requestId).catch(error => {
      logger.error("Data deletion processing failed", "GDPRService", error);
    });

    return {
      requestId,
      estimatedTime: 300, // 5 minutes for deletion
    };
  }

  /**
   * Get request status
   */
  public getRequestStatus(requestId: string): GDPRRequest | null {
    return this.requests.get(requestId) || null;
  }

  /**
   * Get user's GDPR requests
   */
  public getUserRequests(userId: string): GDPRRequest[] {
    return Array.from(this.requests.values()).filter(
      request => request.userId === userId
    );
  }

  /**
   * Process data export
   */
  private async processDataExport(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    try {
      this.updateRequestStatus(requestId, "processing");

      const startTime = Date.now();
      const exportData: DataExport = {
        userId: request.userId,
        exportId: requestId,
        data: {
          conversations: [],
          messages: [],
          userProfile: {},
          analytics: [],
        },
        metadata: {
          exportDate: new Date().toISOString(),
          dataTypes: request.dataTypes,
          recordCount: 0,
          fileSize: 0,
        },
      };

      // Export conversations
      if (request.dataTypes.includes("conversations")) {
        const conversations = await conversationService.getUserConversations(
          request.userId
        );
        exportData.data.conversations = conversations.data;
        exportData.metadata.recordCount += conversations.data.length;
      }

      // Export messages
      if (request.dataTypes.includes("messages")) {
        const conversations = await conversationService.getUserConversations(
          request.userId
        );
        const allMessages = [];

        for (const conversation of conversations.data) {
          const messages = await messageService.getConversationMessages(
            conversation.id
          );
          allMessages.push(...messages.data);
        }

        exportData.data.messages = allMessages;
        exportData.metadata.recordCount += allMessages.length;
      }

      // Export user profile
      if (request.dataTypes.includes("profile")) {
        // This would fetch user profile data
        exportData.data.userProfile = {
          userId: request.userId,
          exportDate: new Date().toISOString(),
        };
      }

      // Export analytics
      if (request.dataTypes.includes("analytics")) {
        // This would fetch analytics data
        exportData.data.analytics = [];
      }

      // Calculate file size (approximate)
      exportData.metadata.fileSize = JSON.stringify(exportData).length;

      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime, true);

      this.updateRequestStatus(requestId, "completed");

      logger.info("Data export completed successfully", "GDPRService", {
        requestId,
        userId: request.userId,
        processingTime,
        recordCount: exportData.metadata.recordCount,
        fileSize: exportData.metadata.fileSize,
      });

      // In a real implementation, you would store the export data
      // and provide a download link to the user
    } catch (error) {
      this.updateRequestStatus(requestId, "failed");
      this.updateStats(0, false);

      logger.error("Data export failed", "GDPRService", error);
      throw error;
    }
  }

  /**
   * Process data deletion
   */
  private async processDataDeletion(requestId: string): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error("Request not found");
    }

    try {
      this.updateRequestStatus(requestId, "processing");

      const startTime = Date.now();
      const deletionConfirmation: DeletionConfirmation = {
        userId: request.userId,
        deletionId: requestId,
        deletedData: {
          conversations: 0,
          messages: 0,
          analytics: 0,
        },
        metadata: {
          deletionDate: new Date().toISOString(),
          retentionPeriod: 30, // 30 days retention
          anonymized: true,
        },
      };

      // Get user conversations
      const conversations = await conversationService.getUserConversations(
        request.userId
      );

      // Delete messages in each conversation
      for (const conversation of conversations.data) {
        const messages = await messageService.getConversationMessages(
          conversation.id
        );

        // Soft delete messages (mark as deleted)
        for (const message of messages.data) {
          await messageService.updateMessageStatus(message.id, "deleted");
          deletionConfirmation.deletedData.messages++;
        }

        // Soft delete conversation
        await conversationService.updateConversation(conversation.id, {
          status: "deleted",
        });
        deletionConfirmation.deletedData.conversations++;
      }

      const processingTime = Date.now() - startTime;
      this.updateStats(processingTime, true);

      this.updateRequestStatus(requestId, "completed");

      logger.info("Data deletion completed successfully", "GDPRService", {
        requestId,
        userId: request.userId,
        processingTime,
        deletedConversations: deletionConfirmation.deletedData.conversations,
        deletedMessages: deletionConfirmation.deletedData.messages,
      });

      // In a real implementation, you would store the deletion confirmation
      // and send confirmation to the user
    } catch (error) {
      this.updateRequestStatus(requestId, "failed");
      this.updateStats(0, false);

      logger.error("Data deletion failed", "GDPRService", error);
      throw error;
    }
  }

  /**
   * Anonymize user data (alternative to deletion)
   */
  public async anonymizeUserData(userId: string): Promise<void> {
    try {
      logger.info("Anonymizing user data", "GDPRService", { userId });

      // Anonymize conversations
      const conversations =
        await conversationService.getUserConversations(userId);
      for (const conversation of conversations.data) {
        await conversationService.updateConversation(conversation.id, {
          title: `Anonymized Conversation ${conversation.id.slice(-8)}`,
          description: "Anonymized for privacy",
        });
      }

      // Anonymize messages (if encryption is available)
      if (encryptionService.isReady()) {
        for (const conversation of conversations.data) {
          const messages = await messageService.getConversationMessages(
            conversation.id
          );
          for (const message of messages.data) {
            if (message.role === "user") {
              const encryptedContent =
                await encryptionService.encryptMessageContent(
                  "[ANONYMIZED]",
                  message.id
                );
              await messageService.updateMessage(message.id, {
                content: encryptedContent.encryptedData,
                metadata: {
                  ...message.metadata,
                  anonymized: true,
                  anonymizationDate: new Date().toISOString(),
                },
              });
            }
          }
        }
      }

      logger.info("User data anonymized successfully", "GDPRService", {
        userId,
      });
    } catch (error) {
      logger.error("Failed to anonymize user data", "GDPRService", error);
      throw error;
    }
  }

  /**
   * Generate request ID
   */
  private generateRequestId(type: string, userId: string): string {
    return `${type}-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update request status
   */
  private updateRequestStatus(
    requestId: string,
    status: GDPRRequest["status"]
  ): void {
    const request = this.requests.get(requestId);
    if (request) {
      request.status = status;
      this.requests.set(requestId, request);
    }
  }

  /**
   * Calculate estimated processing time
   */
  private calculateEstimatedTime(dataTypes: string[]): number {
    let baseTime = 60; // 1 minute base

    if (dataTypes.includes("messages")) baseTime += 120; // +2 minutes for messages
    if (dataTypes.includes("analytics")) baseTime += 60; // +1 minute for analytics

    return baseTime;
  }

  /**
   * Update statistics
   */
  private updateStats(processingTime: number, success: boolean): void {
    const totalProcessed =
      this.stats.exportRequests + this.stats.deletionRequests;

    if (totalProcessed > 0) {
      this.stats.averageProcessingTime =
        (this.stats.averageProcessingTime * (totalProcessed - 1) +
          processingTime) /
        totalProcessed;
    }

    const successfulRequests = Array.from(this.requests.values()).filter(
      req => req.status === "completed"
    ).length;

    this.stats.successRate =
      totalProcessed > 0 ? (successfulRequests / totalProcessed) * 100 : 0;
  }

  /**
   * Get GDPR statistics
   */
  public getGDPRStats(): GDPRStats {
    return { ...this.stats };
  }

  /**
   * Reset GDPR statistics
   */
  public resetStats(): void {
    this.stats = {
      totalRequests: 0,
      exportRequests: 0,
      deletionRequests: 0,
      averageProcessingTime: 0,
      successRate: 0,
    };
  }

  /**
   * Clear old requests
   */
  public clearOldRequests(maxAge: number = 90 * 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let clearedCount = 0;

    for (const [requestId, request] of this.requests.entries()) {
      const requestAge = now - new Date(request.timestamp).getTime();
      if (requestAge > maxAge && request.status === "completed") {
        this.requests.delete(requestId);
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      logger.info(`Cleared ${clearedCount} old GDPR requests`, "GDPRService");
    }

    return clearedCount;
  }
}

// Export singleton instance
export const gdprService = GDPRService.getInstance();

// Export types
export type { GDPRRequest, DataExport, DeletionConfirmation, GDPRStats };
