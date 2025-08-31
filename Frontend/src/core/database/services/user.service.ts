/**
 * User Service
 * Handles user CRUD operations, profile management, and preferences
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db, COLLECTIONS, DB_CONFIG } from "../firestore.config";
import { logger } from "../../../shared/utils/logger";
import type {
  UserDocument,
  UserPreferencesDocument,
  PaginationParams,
  PaginatedResponse,
  QueryOptions,
} from "../types/database.types";
import {
  addTimestamps,
  updateTimestamp,
  sanitizeData,
} from "../utils/database.utils";

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Create a new user profile
   */
  async createUser(userData: Partial<UserDocument>): Promise<UserDocument> {
    try {
      const sanitizedData = sanitizeData(userData);
      const userDocData = addTimestamps({
        ...sanitizedData,
        status: "active",
        last_seen: serverTimestamp(),
        subscription_tier: "free",
        usage_limits: {
          messages_per_month: 100,
          conversations_per_month: 10,
          current_month_messages: 0,
          current_month_conversations: 0,
          ...sanitizedData.usage_limits,
        },
        preferences: {
          theme: "light",
          language: "en",
          notifications: true,
          privacy_settings: {
            profile_visibility: "private",
            allow_analytics: true,
            allow_marketing: false,
          },
          ...sanitizedData.preferences,
        },
      });

      const docRef = await addDoc(
        collection(db, COLLECTIONS.USERS),
        userDocData
      );
      const user = await getDoc(docRef);

      const result = {
        id: docRef.id,
        ...user.data(),
      } as UserDocument;

      logger.info("User created successfully", "UserService", {
        userId: docRef.id,
        uid: userData.uid,
      });

      return result;
    } catch (error) {
      logger.error("Failed to create user", "UserService", error);
      throw new Error("Failed to create user profile");
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserDocument | null> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const result = {
        id: userDoc.id,
        ...userData,
      } as UserDocument;

      logger.info("User retrieved successfully", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });

      return result;
    } catch (error) {
      logger.error("Failed to get user", "UserService", error);
      throw new Error("Failed to retrieve user profile");
    }
  }

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<UserDocument>
  ): Promise<UserDocument> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = snapshot.docs[0];
      const sanitizedUpdates = sanitizeData(updates);
      const updateData = updateTimestamp(sanitizedUpdates);

      await updateDoc(userDoc.ref, updateData);

      const updatedUser = await getDoc(userDoc.ref);
      const result = {
        id: userDoc.id,
        ...updatedUser.data(),
      } as UserDocument;

      logger.info("User updated successfully", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });

      return result;
    } catch (error) {
      logger.error("Failed to update user", "UserService", error);
      throw new Error("Failed to update user profile");
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string,
    preferences: Partial<UserPreferencesDocument>
  ): Promise<void> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = snapshot.docs[0];
      const sanitizedPreferences = sanitizeData(preferences);

      await updateDoc(userDoc.ref, {
        preferences: {
          ...userDoc.data().preferences,
          ...sanitizedPreferences,
        },
        updated_at: serverTimestamp(),
      });

      logger.info("User preferences updated successfully", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });
    } catch (error) {
      logger.error("Failed to update user preferences", "UserService", error);
      throw new Error("Failed to update user preferences");
    }
  }

  /**
   * Update user usage limits
   */
  async updateUsageLimits(
    userId: string,
    usageUpdates: Partial<UserDocument["usage_limits"]>
  ): Promise<void> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(userDoc.ref, {
        usage_limits: {
          ...userDoc.data().usage_limits,
          ...usageUpdates,
        },
        updated_at: serverTimestamp(),
      });

      logger.info("User usage limits updated successfully", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });
    } catch (error) {
      logger.error("Failed to update usage limits", "UserService", error);
      throw new Error("Failed to update usage limits");
    }
  }

  /**
   * Increment message count
   */
  async incrementMessageCount(userId: string): Promise<void> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(userDoc.ref, {
        "usage_limits.current_month_messages": increment(1),
        updated_at: serverTimestamp(),
      });

      logger.info("Message count incremented", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });
    } catch (error) {
      logger.error("Failed to increment message count", "UserService", error);
      throw new Error("Failed to update message count");
    }
  }

  /**
   * Increment conversation count
   */
  async incrementConversationCount(userId: string): Promise<void> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(userDoc.ref, {
        "usage_limits.current_month_conversations": increment(1),
        updated_at: serverTimestamp(),
      });

      logger.info("Conversation count incremented", "UserService", {
        userId: userDoc.id,
        uid: userId,
      });
    } catch (error) {
      logger.error(
        "Failed to increment conversation count",
        "UserService",
        error
      );
      throw new Error("Failed to update conversation count");
    }
  }

  /**
   * Update user last seen
   */
  async updateLastSeen(userId: string): Promise<void> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        return; // User not found, but don't throw error for last seen updates
      }

      const userDoc = snapshot.docs[0];

      await updateDoc(userDoc.ref, {
        last_seen: serverTimestamp(),
      });
    } catch (error) {
      logger.error("Failed to update last seen", "UserService", error);
      // Don't throw error for last seen updates
    }
  }

  /**
   * Get users with pagination
   */
  async getUsers(
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<UserDocument>> {
    try {
      const { limit: limitParam = DB_CONFIG.CONVERSATIONS_PER_PAGE } = params;

      const usersQuery = query(
        collection(db, COLLECTIONS.USERS),
        orderBy("created_at", "desc"),
        limit(limitParam)
      );

      const snapshot = await getDocs(usersQuery);

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as UserDocument[];

      const result: PaginatedResponse<UserDocument> = {
        data: users,
        hasMore: snapshot.docs.length === limitParam,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
        totalCount: users.length,
      };

      logger.info("Users retrieved successfully", "UserService", {
        count: users.length,
      });

      return result;
    } catch (error) {
      logger.error("Failed to get users", "UserService", error);
      throw new Error("Failed to retrieve users");
    }
  }

  /**
   * Search users
   */
  async searchUsers(
    searchTerm: string,
    limit: number = 10
  ): Promise<UserDocument[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple prefix search on name field
      const usersQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff"),
        limit(limit)
      );

      const snapshot = await getDocs(usersQuery);

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as UserDocument[];

      logger.info("Users search completed", "UserService", {
        searchTerm,
        count: users.length,
      });

      return users;
    } catch (error) {
      logger.error("Failed to search users", "UserService", error);
      throw new Error("Failed to search users");
    }
  }

  /**
   * Check if user exists
   */
  async userExists(userId: string): Promise<boolean> {
    try {
      const userQuery = query(
        collection(db, COLLECTIONS.USERS),
        where("uid", "==", userId),
        limit(1)
      );

      const snapshot = await getDocs(userQuery);
      return !snapshot.empty;
    } catch (error) {
      logger.error("Failed to check if user exists", "UserService", error);
      return false;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalMessages: number;
    totalConversations: number;
    subscriptionTier: string;
    usagePercentage: number;
  }> {
    try {
      const user = await this.getUserById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const { usage_limits, subscription_tier } = user;
      const usagePercentage = Math.round(
        (usage_limits.current_month_messages /
          usage_limits.messages_per_month) *
          100
      );

      return {
        totalMessages: usage_limits.current_month_messages,
        totalConversations: usage_limits.current_month_conversations,
        subscriptionTier: subscription_tier,
        usagePercentage,
      };
    } catch (error) {
      logger.error("Failed to get user stats", "UserService", error);
      throw new Error("Failed to retrieve user statistics");
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();
