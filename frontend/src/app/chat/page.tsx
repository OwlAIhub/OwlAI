'use client';

import { useAuth } from '@/components/auth/providers/AuthProvider';
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
import { motion } from 'framer-motion';
import { Home, LogOut, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../../components/ui/buttons/button';

export default function ChatPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      type: 'user' | 'bot';
      content: string;
      timestamp: Date;
    }>
  >([]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600'></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
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
            <Button
              variant='ghost'
              size='sm'
              onClick={handleBackToHome}
              className='text-muted-foreground hover:text-foreground'
            >
              <Home className='w-4 h-4 mr-2' />
              Home
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={handleLogout}
              className='text-muted-foreground hover:text-foreground'
            >
              <LogOut className='w-4 h-4 mr-2' />
              Logout
            </Button>
          </div>
        </header>

        {/* Chat Content */}
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          {/* Chat Messages */}
          <div className='flex-1 rounded-xl bg-muted/50 p-4'>
            <div className='space-y-4 max-h-[500px] overflow-y-auto'>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className='text-sm'>{msg.content}</p>
                    <p className='text-xs opacity-70 mt-1'>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
