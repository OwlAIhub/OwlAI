/**
 * Message Listeners
 */
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, COLLECTIONS } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type {
  MessageDocument,
  RealtimeListener,
} from "../types/database.types";

export const listenToConversationMessages = (
  conversationId: string,
  onData: (messages: MessageDocument[]) => void,
  onError: (error: any) => void
): RealtimeListener => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("conversation_id", "==", conversationId),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        const messages: MessageDocument[] = [];
        querySnapshot.forEach(d => {
          messages.push({ id: d.id, ...d.data() } as MessageDocument);
        });
        onData(messages);
      },
      error => {
        logger.error(
          "Conversation messages listener error",
          "MessageService",
          error
        );
        onError(error);
      }
    );

    logger.info("Conversation messages listener started", "MessageService", {
      conversationId,
    });

    return { unsubscribe, onData, onError };
  } catch (error) {
    logger.error(
      "Failed to start conversation messages listener",
      "MessageService",
      error
    );
    throw new Error("Failed to start messages listener");
  }
};

export const listenToNewMessages = (
  conversationId: string,
  onData: (message: MessageDocument) => void,
  onError: (error: any) => void
): RealtimeListener => {
  try {
    const q = query(
      collection(db, COLLECTIONS.MESSAGES),
      where("conversation_id", "==", conversationId),
      orderBy("created_at", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      querySnapshot => {
        if (!querySnapshot.empty) {
          const d = querySnapshot.docs[0];
          const message = { id: d.id, ...d.data() } as MessageDocument;
          onData(message);
        }
      },
      error => {
        logger.error("New messages listener error", "MessageService", error);
        onError(error);
      }
    );

    logger.info("New messages listener started", "MessageService", {
      conversationId,
    });

    return { unsubscribe, onData, onError };
  } catch (error) {
    logger.error(
      "Failed to start new messages listener",
      "MessageService",
      error
    );
    throw new Error("Failed to start new messages listener");
  }
};
