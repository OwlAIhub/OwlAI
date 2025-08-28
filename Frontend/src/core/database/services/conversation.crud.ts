/**
 * Conversation CRUD helpers
 */
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type { ConversationDocument } from "../types/database.types";

export const createConversation = async (
  userId: string,
  data: Partial<ConversationDocument>
): Promise<ConversationDocument> => {
  try {
    const conversationData: Partial<ConversationDocument> = {
      user_id: userId,
      title: data.title || "New Conversation",
      description: data.description,
      status: "active",
      type: data.type || "chat",
      settings: {
        auto_save: true,
        message_history_limit: 100,
        typing_indicator: true,
        read_receipts: true,
        ...data.settings,
      },
      metadata: {
        total_messages: 0,
        participants: [userId],
        tags: [],
        ...data.metadata,
      },
      analytics: {
        total_duration: 0,
        average_response_time: 0,
        ...data.analytics,
      },
      created_at: serverTimestamp() as any,
      updated_at: serverTimestamp() as any,
    };

    const docRef = await addDoc(
      collection(db, COLLECTIONS.CONVERSATIONS),
      conversationData
    );
    const conversation = await getDoc(docRef);

    const result = {
      id: docRef.id,
      ...conversation.data(),
    } as ConversationDocument;

    logger.info("Conversation created successfully", "ConversationService", {
      conversationId: docRef.id,
      userId,
    });

    return result;
  } catch (error) {
    logger.error("Failed to create conversation", "ConversationService", error);
    throw new Error("Failed to create conversation");
  }
};

export const getConversationById = async (
  conversationId: string
): Promise<ConversationDocument | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ConversationDocument;
    }
    return null;
  } catch (error) {
    logger.error("Failed to get conversation", "ConversationService", error);
    throw new Error("Failed to get conversation");
  }
};

export const updateConversation = async (
  conversationId: string,
  updates: Partial<ConversationDocument>
): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(ref, { ...updates, updated_at: serverTimestamp() });
    logger.info("Conversation updated successfully", "ConversationService", {
      conversationId,
      updates: Object.keys(updates),
    });
  } catch (error) {
    logger.error("Failed to update conversation", "ConversationService", error);
    throw new Error("Failed to update conversation");
  }
};

export const softUpdateStatus = async (
  conversationId: string,
  status: ConversationDocument["status"]
): Promise<void> => {
  await updateConversation(conversationId, { status });
};

export const updateConversationMetadata = async (
  conversationId: string,
  metadata: Partial<ConversationDocument["metadata"]>
): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(ref, { metadata, updated_at: serverTimestamp() });
    logger.info("Conversation metadata updated", "ConversationService", {
      conversationId,
      metadata: Object.keys(metadata),
    });
  } catch (error) {
    logger.error(
      "Failed to update conversation metadata",
      "ConversationService",
      error
    );
    throw new Error("Failed to update conversation metadata");
  }
};

export const updateConversationAnalytics = async (
  conversationId: string,
  analytics: Partial<ConversationDocument["analytics"]>
): Promise<void> => {
  try {
    const ref = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(ref, { analytics, updated_at: serverTimestamp() });
    logger.info("Conversation analytics updated", "ConversationService", {
      conversationId,
      analytics: Object.keys(analytics),
    });
  } catch (error) {
    logger.error(
      "Failed to update conversation analytics",
      "ConversationService",
      error
    );
    throw new Error("Failed to update conversation analytics");
  }
};
