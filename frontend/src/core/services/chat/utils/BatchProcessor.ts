/**
 * Batch Processing Utility
 * Handles efficient batching of database operations
 */

import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { legendaryErrorHandler } from "@/lib/monitoring/LegendaryErrorHandler";
import { BatchOperation, ChatServiceConfig } from "../types";

export class BatchProcessor {
  private static instance: BatchProcessor;
  private batchQueue: BatchOperation[] = [];
  private batchTimer?: NodeJS.Timeout;
  
  private readonly config: ChatServiceConfig = {
    BATCH_SIZE: 10,
    BATCH_TIMEOUT: 500, // 500ms
    CACHE_TTL: 5 * 60 * 1000 // 5 minutes
  };

  static getInstance(): BatchProcessor {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor();
      BatchProcessor.instance.startBatchProcessor();
    }
    return BatchProcessor.instance;
  }

  async batchOperation(operation: BatchOperation): Promise<void> {
    this.batchQueue.push(operation);

    if (this.batchQueue.length >= this.config.BATCH_SIZE) {
      await this.processBatchQueue();
    } else {
      this.scheduleBatchProcessing();
    }
  }

  private startBatchProcessor(): void {
    this.scheduleBatchProcessing();
  }

  private scheduleBatchProcessing(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(async () => {
      if (this.batchQueue.length > 0) {
        await this.processBatchQueue();
      }
    }, this.config.BATCH_TIMEOUT);
  }

  private async processBatchQueue(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const operationsToProcess = [...this.batchQueue];
    this.batchQueue = [];

    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = undefined;
    }

    try {
      const batch = writeBatch(db);

      for (const operation of operationsToProcess) {
        const docRef = doc(db, operation.collection, operation.id);

        switch (operation.type) {
          case 'create':
            if (operation.data) {
              batch.set(docRef, operation.data as any);
            }
            break;
          case 'update':
            if (operation.data) {
              batch.update(docRef, operation.data as any);
            }
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      }

      await batch.commit();

    } catch (error) {
      legendaryErrorHandler.captureError(
        error as Error,
        { component: 'BatchProcessor', action: 'processBatchQueue' },
        'high'
      );
      throw error;
    }
  }

  async flushBatch(): Promise<void> {
    if (this.batchQueue.length > 0) {
      await this.processBatchQueue();
    }
  }

  getBatchQueueSize(): number {
    return this.batchQueue.length;
  }
}