import { useState, useEffect, useRef, useCallback } from 'react';
import { User, LoadingState } from '@/types';
import { api } from '@/services/api';
import { storage } from '@/utils';
import { STORAGE_KEYS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { auth } from '@/firebase.js';
import { toast } from 'react-toastify';

interface UseAuthReturn {
  // State
  isLoggedIn: boolean;
  authReady: boolean;
  sessionId: string | null;
  user: User | null;
  loading: LoadingState;
  error: string | null;
  
  // Actions
  setSessionId: (id: string | null) => void;
  createNewSession: (userId: string) => Promise<string | null>;
  handleLogout: () => Promise<void>;
  initializeAnonymousSession: () => Promise<void>;
  clearError: () => void;
  retry: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const sessionCreatedRef = useRef(false);
  const retryCountRef = useRef(0);

  // Utility functions
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(async () => {
    if (retryCountRef.current < 3) {
      retryCountRef.current++;
      clearError();
      // Retry the last failed operation
      if (user?.uid) {
        await createNewSession(user.uid);
      }
    } else {
      setError('Maximum retry attempts reached. Please refresh the page.');
    }
  }, [user?.uid]);

  // Create new session
  const createNewSession = useCallback(async (userId: string): Promise<string | null> => {
    if (sessionCreatedRef.current) return null;
    
    try {
      sessionCreatedRef.current = true;
      setLoading('loading');
      setError(null);
      
      const response = await api.session.createSession(userId);
      
      if (response.status === 'success' && response.data?.session_id) {
        const newSessionId = response.data.session_id;
        setSessionId(newSessionId);
        storage.set(STORAGE_KEYS.SESSION_ID, newSessionId);
        setLoading('success');
        retryCountRef.current = 0; // Reset retry count on success
        return newSessionId;
      } else {
        throw new Error(response.error || 'Failed to create session');
      }
    } catch (err) {
      console.error("Failed to create session:", err);
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      setLoading('error');
      toast.error("Failed to create chat session");
      return null;
    } finally {
      sessionCreatedRef.current = false;
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      setLoading('loading');
      setError(null);
      
      await auth.signOut();
      
      // Clear all state
      storage.clear();
      setUser(null);
      setSessionId(null);
      setIsLoggedIn(false);
      setLoading('success');
      
      toast.info(SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    } catch (err) {
      console.error("Failed to sign out:", err);
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
      setLoading('error');
      toast.error("Failed to sign out.");
    }
  }, []);

  // Initialize anonymous session
  const initializeAnonymousSession = useCallback(async (): Promise<void> => {
    if (
      storage.get(STORAGE_KEYS.ANONYMOUS_SESSION_ID) || 
      storage.get(STORAGE_KEYS.ANONYMOUS_SESSION_INITIALIZED)
    ) {
      return;
    }

    try {
      setError(null);
      const response = await api.session.initAnonymousSession();
      
      if (response.status === 'success' && response.data) {
        console.log("Anonymous session initialized:", response.data);
        
        storage.set(STORAGE_KEYS.ANONYMOUS_SESSION_ID, response.data.session_id);
        storage.set(STORAGE_KEYS.ANONYMOUS_USER_ID, response.data.user_id);
        storage.set(STORAGE_KEYS.ANONYMOUS_SESSION_INITIALIZED, "true");
      } else {
        throw new Error(response.error || 'Failed to initialize anonymous session');
      }
    } catch (err) {
      console.error("Failed to initialize anonymous session:", err);
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC_ERROR;
      setError(errorMessage);
    }
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      const wasLoggedIn = isLoggedIn;
      setIsLoggedIn(!!firebaseUser);
      setAuthReady(true);

      if (firebaseUser && !wasLoggedIn) {
        // User logged in - get user data and create session
        const userData: User = {
          uid: firebaseUser.uid,
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ')[1] || '',
          email: firebaseUser.email || '',
        };
        
        setUser(userData);
        storage.set(STORAGE_KEYS.USER, userData);
        createNewSession(firebaseUser.uid);
      } else if (!firebaseUser && wasLoggedIn) {
        // User logged out - cleanup
        storage.remove(STORAGE_KEYS.SESSION_ID);
        storage.remove(STORAGE_KEYS.USER);
        setSessionId(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  // Initialize anonymous session on mount
  useEffect(() => {
    initializeAnonymousSession();
  }, [sessionId]);

  // Load cached user data
  useEffect(() => {
    const cachedUser = storage.get<User>(STORAGE_KEYS.USER);
    if (cachedUser) {
      setUser(cachedUser);
    }
  }, []);

  return {
    // State
    isLoggedIn,
    authReady,
    sessionId,
    user,
    loading,
    error,
    
    // Actions
    setSessionId,
    createNewSession,
    handleLogout,
    initializeAnonymousSession,
    clearError,
    retry,
  };
};
