'use client';

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { ChatContainer } from '@/components/chat';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Home, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';
import { useUserProfile } from '../../hooks/useUserProfile';

export default function ChatPage() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    userProfile,
    isLoading: profileLoading,
    initializeUser,
  } = useUserProfile();

  // Initialize user profile when user is authenticated
  useEffect(() => {
    if (user && !userProfile && !profileLoading) {
      initializeUser();
    }
  }, [user, userProfile, profileLoading, initializeUser]);

  if (authLoading || profileLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  return (
    <div className='h-screen flex overflow-hidden'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className='flex flex-col h-full w-full'>
          {/* Fixed Header - Never scrolls */}
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-gray-200'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 h-4' />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='/'>
                      <Home className='h-4 w-4' />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage className='flex items-center gap-2'>
                      <MessageSquare className='h-4 w-4' />
                      Chat
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Header Actions */}
            <div className='ml-auto flex items-center gap-2 px-4'>
              {user?.phoneNumber && (
                <span className='text-sm text-muted-foreground hidden md:block'>
                  {user.phoneNumber}
                </span>
              )}
            </div>
          </header>

          {/* Chat Container - Takes remaining space */}
          <div className='flex-1 min-h-0'>
            <ChatContainer />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
