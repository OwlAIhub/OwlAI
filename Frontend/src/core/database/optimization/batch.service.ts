/**
 * Batch Service
 * Handles batching of database operations for write optimization
 */

import {
  writeBatch,
  doc,
  collection,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type {
  MessageDocument,
  ConversationDocument,
} from "../types/database.types";

interface BatchOperation {
  type: "set" | "update" | "delete" | "increment";
  collection: string;
  docId?: string;
  data?: any;
  path?: string;
}

interface BatchStats {
  totalOperations: number;
  successfulBatches: number;
  failedBatches: number;
  averageBatchSize: number;
}

class BatchService {
  private static instance: BatchService;
  private operationQueue: BatchOperation[] = [];
  private batchSize: number = 500; // Firestore batch limit
  private flushInterval: number = 1000; // 1 second
  private stats: BatchStats = {
    totalOperations: 0,
    successfulBatches: 0,
    failedBatches: 0,
    averageBatchSize: 0,
  };

  private constructor() {
    this.startFlushInterval();
  }

  public static getInstance(): BatchService {
    if (!BatchService.instance) {
      BatchService.instance = new BatchService();
    }
    return BatchService.instance;
  }

  /**
   * Add message to batch queue
   */
  public addMessage(messageData: Partial<MessageDocument>): void {
    const operation: BatchOperation = {
      type: "set",
      collection: COLLECTIONS.MESSAGES,
      data: {
        ...messageData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      },
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Add conversation update to batch queue
   */
  public addConversationUpdate(
    conversationId: string,
    updateData: Partial<ConversationDocument>
  ): void {
    const operation: BatchOperation = {
      type: "update",
      collection: COLLECTIONS.CONVERSATIONS,
      docId: conversationId,
      data: {
        ...updateData,
        updated_at: serverTimestamp(),
      },
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Add conversation metadata increment to batch queue
   */
  public addConversationIncrement(
    conversationId: string,
    field: string,
    value: number = 1
  ): void {
    const operation: BatchOperation = {
      type: "increment",
      collection: COLLECTIONS.CONVERSATIONS,
      docId: conversationId,
      path: `metadata.${field}`,
      data: increment(value),
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Add conversation metadata update to batch queue
   */
  public addConversationMetadataUpdate(
    conversationId: string,
    metadataUpdates: Partial<ConversationDocument["metadata"]>
  ): void {
    const operation: BatchOperation = {
      type: "update",
      collection: COLLECTIONS.CONVERSATIONS,
      docId: conversationId,
      data: {
        metadata: metadataUpdates,
        updated_at: serverTimestamp(),
      },
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Add message status update to batch queue
   */
  public addMessageStatusUpdate(
    messageId: string,
    status: MessageDocument["status"]
  ): void {
    const operation: BatchOperation = {
      type: "update",
      collection: COLLECTIONS.MESSAGES,
      docId: messageId,
      data: {
        status,
        updated_at: serverTimestamp(),
      },
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Add multiple messages to batch queue
   */
  public addMessages(messages: Partial<MessageDocument>[]): void {
    for (const message of messages) {
      this.addMessage(message);
    }
  }

  /**
   * Add conversation analytics update to batch queue
   */
  public addAnalyticsUpdate(
    conversationId: string,
    analytics: Partial<ConversationDocument["analytics"]>
  ): void {
    const operation: BatchOperation = {
      type: "update",
      collection: COLLECTIONS.CONVERSATIONS,
      docId: conversationId,
      data: {
        analytics: {
          ...analytics,
          updated_at: serverTimestamp(),
        },
      },
    };

    this.operationQueue.push(operation);
    this.checkAndFlush();
  }

  /**
   * Force flush all pending operations
   */
  public async flush(): Promise<void> {
    if (this.operationQueue.length === 0) {
      return;
    }

    try {
      await this.executeBatch();
      logger.info(
        `Flushed ${this.operationQueue.length} operations`,
        "BatchService"
      );
    } catch (error) {
      logger.error("Failed to flush batch operations", "BatchService", error);
      throw error;
    }
  }

  /**
   * Get batch statistics
   */
  public getStats(): BatchStats {
    return { ...this.stats };
  }

  /**
   * Reset batch statistics
   */
  public resetStats(): void {
    this.stats = {
      totalOperations: 0,
      successfulBatches: 0,
      failedBatches: 0,
      averageBatchSize: 0,
    };
  }

  /**
   * Check if queue needs flushing and flush if necessary
   */
  private checkAndFlush(): void {
    if (this.operationQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Execute batch operations
   */
  private async executeBatch(): Promise<void> {
    if (this.operationQueue.length === 0) {
      return;
    }

    const batch = writeBatch(db);
    const operationsToExecute = this.operationQueue.splice(0, this.batchSize);
    let operationCount = 0;

    try {
      for (const operation of operationsToExecute) {
        const docRef = doc(
          collection(db, operation.collection),
          operation.docId
        );

        switch (operation.type) {
          case "set":
            batch.set(docRef, operation.data);
            break;
          case "update":
            batch.update(docRef, operation.data);
            break;
          case "delete":
            batch.delete(docRef);
            break;
          case "increment":
            if (operation.path) {
              batch.update(docRef, { [operation.path]: operation.data });
            }
            break;
        }

        operationCount++;
      }

      await batch.commit();
      this.stats.successfulBatches++;
      this.stats.totalOperations += operationCount;
      this.updateAverageBatchSize();

      logger.info(
        `Batch executed successfully: ${operationCount} operations`,
        "BatchService"
      );
    } catch (error) {
      this.stats.failedBatches++;
      // Re-queue operations that failed
      this.operationQueue.unshift(...operationsToExecute);
      throw error;
    }
  }

  /**
   * Start automatic flush interval
   */
  private startFlushInterval(): void {
    setInterval(() => {
      if (this.operationQueue.length > 0) {
        this.flush().catch(error => {
          logger.error("Auto-flush failed", "BatchService", error);
        });
      }
    }, this.flushInterval);
  }

  /**
   * Update average batch size statistics
   */
  private updateAverageBatchSize(): void {
    const totalBatches =
      this.stats.successfulBatches + this.stats.failedBatches;
    if (totalBatches > 0) {
      this.stats.averageBatchSize = this.stats.totalOperations / totalBatches;
    }
  }
}

// Export singleton instance
export const batchService = BatchService.getInstance();

// Export types
export type { BatchOperation, BatchStats };
