/**
 * Conversation Listeners
 * Real-time listeners for conversations
 */

import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type {
  ConversationDocument,
  RealtimeListener,
} from "../types/database.types";

export const listenToConversation = (
  conversationId: string,
  onData: (conversation: ConversationDocument | null) => void,
  onError: (error: any) => void
): RealtimeListener => {
  try {
    const docRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);

    const unsubscribe = onSnapshot(
      docRef,
      docSnap => {
        if (docSnap.exists()) {
          const conversation = {
            id: docSnap.id,
            ...docSnap.data(),
          } as ConversationDocument;
          onData(conversation);
        } else {
          onData(null);
        }
      },
      error => {
        logger.error("Conversation listener error", "ConversationService", error);
        onError(error);
      }
    );

    logger.info("Conversation listener started", "ConversationService", {
      conversationId,
    });

    return {
      unsubscribe,
      onData,
      onError,
    };
  } catch (error) {
    logger.error(
      "Failed to start conversation listener",
      "ConversationService",
      error
    );
    throw new Error("Failed to start conversation listener");
  }
};

export const listenToUserConversations = (
  userId: string,
  onData: (conversations: ConversationDocument[]) => void,
  onError: (error: any) => void
): RealtimeListener => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      where("user_id", "==", userId),
      where("status", "!=", "deleted"),
      orderBy("status"),
      orderBy("updated_at", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const conversations: ConversationDocument[] = [];
        querySnapshot.forEach(d => {
          conversations.push({
            id: d.id,
            ...d.data(),
          } as ConversationDocument);
        });
        onData(conversations);
      },
      error => {
        logger.error("User conversations listener error", "ConversationService", error);
        onError(error);
      }
    );

    logger.info("User conversations listener started", "ConversationService", {
      userId,
    });

    return {
      unsubscribe,
      onData,
      onError,
    };
  } catch (error) {
    logger.error(
      "Failed to start user conversations listener",
      "ConversationService",
      error
    );
    throw new Error("Failed to start user conversations listener");
  }
};


