/**
 * Authentication utilities for managing user state
 * This is a simple client-side auth implementation for development
 * In production, you would integrate with Firebase Auth or another auth provider
 */

// Removed QuestionnaireData interface

export interface User {
  id: string;
  phoneNumber: string;
  isAuthenticated: boolean;
  name?: string;
  email?: string;
  avatar?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  onboardingCompleted?: boolean;
}

// Simple in-memory storage for development
// In production, this would be handled by your auth provider
let currentUser: User | null = null;

/**
 * Get the current authenticated user
 */
export function getAuthUser(): User | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }

  // Try to get user from localStorage first
  try {
    const storedUser = localStorage.getItem('owlai_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      currentUser = {
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt) : undefined,
      };
    }
  } catch (error) {
    console.warn('Failed to parse stored user:', error);
    localStorage.removeItem('owlai_user');
  }

  return currentUser;
}

/**
 * Set the authenticated user
 */
export function setAuthUser(user: User): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  currentUser = {
    ...user,
    lastLoginAt: new Date(),
  };

  // Store in localStorage
  try {
    localStorage.setItem('owlai_user', JSON.stringify(currentUser));
  } catch (error) {
    console.warn('Failed to store user:', error);
  }
}

/**
 * Clear the authenticated user (logout)
 */
export function clearAuthUser(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  currentUser = null;
  localStorage.removeItem('owlai_user');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const user = getAuthUser();
  return user?.isAuthenticated === true;
}

/**
 * Get user ID
 */
export function getUserId(): string | null {
  const user = getAuthUser();
  return user?.id || null;
}

/**
 * Get user phone number
 */
export function getUserPhoneNumber(): string | null {
  const user = getAuthUser();
  return user?.phoneNumber || null;
}

/**
 * Update user profile
 */
export function updateUserProfile(updates: Partial<User>): void {
  const currentUser = getAuthUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    setAuthUser(updatedUser);
  }
}

/**
 * Check if user has a specific permission (placeholder for future use)
 */
export function hasPermission(): boolean {
  // For now, all authenticated users have all permissions
  // In production, you would check against user roles/permissions
  return isAuthenticated();
}

/**
 * Get user display name
 */
export function getUserDisplayName(): string {
  const user = getAuthUser();
  if (!user) return 'Guest';

  if (user.name) return user.name;
  if (user.phoneNumber) return user.phoneNumber;
  return 'User';
}

/**
 * Get user avatar URL or initials
 */
export function getUserAvatar(): string | null {
  const user = getAuthUser();
  if (!user) return null;

  if (user.avatar) return user.avatar;

  // Generate initials from name or phone number
  const name = user.name || user.phoneNumber || 'User';
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Return a data URL for initials avatar
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="#0d9488" rx="8"/>
      <text x="20" y="26" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="white">${initials}</text>
    </svg>
  `)}`;
}

/**
 * Initialize auth state (call this on app startup)
 */
export function initializeAuth(): void {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  // Check for existing auth state
  getAuthUser();
}

/**
 * Auth state change listener type
 */
export type AuthStateChangeListener = (user: User | null) => void;

// Simple event system for auth state changes
const authListeners: AuthStateChangeListener[] = [];

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  listener: AuthStateChangeListener
): () => void {
  authListeners.push(listener);

  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(listener);
    if (index > -1) {
      authListeners.splice(index, 1);
    }
  };
}

/**
 * Notify all listeners of auth state change
 */
function notifyAuthStateChange(user: User | null): void {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (error) {
      console.error('Auth state change listener error:', error);
    }
  });
}

// Override setAuthUser and clearAuthUser to notify listeners
const originalSetAuthUser = setAuthUser;
const originalClearAuthUser = clearAuthUser;

export function setAuthUserWithNotification(user: User): void {
  originalSetAuthUser(user);
  notifyAuthStateChange(user);
}

export function clearAuthUserWithNotification(): void {
  originalClearAuthUser();
  notifyAuthStateChange(null);
}
