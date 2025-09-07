'use client';

import { getAuthUser, User } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { FirestoreService } from '@/lib/firestore';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireQuestionnaire?: boolean;
  fallback?: React.ReactNode;
}

interface AuthState {
  isLoading: boolean;
  isAuthorized: boolean;
  user: User | null;
  firebaseUser: FirebaseUser | null;
  error: string | null;
}

export function RouteProtection({
  children,
  requireAuth = true,
  requireQuestionnaire = false,
  fallback,
}: RouteProtectionProps) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthorized: false,
    user: null,
    firebaseUser: null,
    error: null,
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const checkAuth = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Listen to Firebase auth state changes
        unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
          try {
            if (requireAuth && !firebaseUser) {
              // No Firebase user, redirect to home
              setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isAuthorized: false,
                firebaseUser: null,
                user: null,
              }));
              router.push('/');
              return;
            }

            if (firebaseUser) {
              // Firebase user exists, check local user data
              const localUser = getAuthUser();

              if (!localUser?.isAuthenticated) {
                // Local user data missing, try to fetch from Firestore
                try {
                  const firestoreUser = await FirestoreService.getUserByPhone(
                    firebaseUser.phoneNumber || ''
                  );

                  if (firestoreUser) {
                    // Update local storage with Firestore data
                    const updatedLocalUser = {
                      ...FirestoreService.convertToLocalUser(firestoreUser),
                      isAuthenticated: true,
                    };
                    localStorage.setItem(
                      'authUser',
                      JSON.stringify(updatedLocalUser)
                    );

                    setAuthState(prev => ({
                      ...prev,
                      user: updatedLocalUser,
                      firebaseUser,
                    }));
                  } else {
                    // User not found in Firestore, redirect to questionnaire
                    router.push('/questionnaire');
                    return;
                  }
                } catch (error) {
                  console.error('Error fetching user from Firestore:', error);
                  router.push('/');
                  return;
                }
              } else {
                setAuthState(prev => ({
                  ...prev,
                  user: localUser,
                  firebaseUser,
                }));
              }

              // Check questionnaire completion
              const currentUser = localUser || authState.user;
              if (currentUser) {
                if (
                  requireQuestionnaire &&
                  !currentUser.isQuestionnaireComplete
                ) {
                  // User needs to complete questionnaire
                  router.push('/questionnaire');
                  return;
                }

                if (
                  !requireQuestionnaire &&
                  !currentUser.isQuestionnaireComplete
                ) {
                  // User is authenticated but hasn't completed questionnaire
                  router.push('/questionnaire');
                  return;
                }

                if (
                  requireQuestionnaire &&
                  currentUser.isQuestionnaireComplete
                ) {
                  // User already completed questionnaire, redirect to chat
                  router.push('/chat');
                  return;
                }
              }

              setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isAuthorized: true,
              }));
            } else if (!requireAuth) {
              // Route doesn't require auth, allow access
              setAuthState(prev => ({
                ...prev,
                isLoading: false,
                isAuthorized: true,
              }));
            }
          } catch (error) {
            console.error('Auth state change error:', error);
            setAuthState(prev => ({
              ...prev,
              isLoading: false,
              isAuthorized: false,
              error: 'Authentication error occurred',
            }));
            router.push('/');
          }
        });
      } catch (error) {
        console.error('Route protection error:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isAuthorized: false,
          error: 'Route protection error',
        }));
        router.push('/');
      }
    };

    checkAuth();

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router, requireAuth, requireQuestionnaire, authState.user]);

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4'></div>
          <p className='text-muted-foreground'>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (authState.error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <div className='text-red-500 mb-4'>
            <svg
              className='w-12 h-12 mx-auto'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-xl font-semibold mb-2'>Authentication Error</h2>
          <p className='text-muted-foreground mb-4'>{authState.error}</p>
          <button
            onClick={() => router.push('/')}
            className='px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors'
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Show custom fallback if provided
  if (!authState.isAuthorized && fallback) {
    return <>{fallback}</>;
  }

  // Not authorized
  if (!authState.isAuthorized) {
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}
