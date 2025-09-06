// Simple authentication utilities
export interface User {
  id: string;
  phoneNumber: string;
  isAuthenticated: boolean;
}

const AUTH_KEY = 'owl_ai_auth';

export function setAuthUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getAuthUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function clearAuthUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  const user = getAuthUser();
  return user?.isAuthenticated ?? false;
}
