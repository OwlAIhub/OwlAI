'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RouteGuardOptions {
  requireAuth?: boolean;
  requireQuestionnaire?: boolean;
  redirectTo?: string;
  allowAccess?: boolean;
}

export function useRouteGuard(options: RouteGuardOptions = {}) {
  const {
    requireAuth = true,
    requireQuestionnaire = false,
    redirectTo,
    allowAccess = false,
  } = options;

  const { user, isLoading, isAuthenticated, isQuestionnaireComplete } =
    useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If access is explicitly allowed, don't redirect
    if (allowAccess) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/');
      return;
    }

    // Check questionnaire requirement
    if (requireQuestionnaire && !isQuestionnaireComplete) {
      router.push('/questionnaire');
      return;
    }

    // If user is authenticated but hasn't completed questionnaire
    // and we're not on questionnaire page, redirect to questionnaire
    if (isAuthenticated && !isQuestionnaireComplete && !requireQuestionnaire) {
      router.push('/questionnaire');
      return;
    }

    // If user completed questionnaire but trying to access questionnaire page
    if (isQuestionnaireComplete && requireQuestionnaire) {
      router.push('/chat');
      return;
    }
  }, [
    isLoading,
    isAuthenticated,
    isQuestionnaireComplete,
    requireAuth,
    requireQuestionnaire,
    redirectTo,
    allowAccess,
    router,
  ]);

  return {
    isLoading,
    isAuthenticated,
    isQuestionnaireComplete,
    user,
  };
}
