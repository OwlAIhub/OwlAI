/* eslint-disable @next/next/no-img-element */
'use client';

import { Plus } from 'lucide-react';
import * as React from 'react';

import { useAuth } from '@/components/auth/providers/AuthProvider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useChatManager } from '@/hooks/useChatManager';
import { useRouter } from 'next/navigation';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { startNewChat } = useChatManager();
  const { user } = useAuth();

  const handleNewChat = async () => {
    await startNewChat();
    router.push('/chat');
  };

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex aspect-square size-8 items-center justify-center'>
                  <img
                    src='/owl-ai-logo.png'
                    alt='OwlAI Logo'
                    className='w-6 h-6 object-contain'
                  />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Owl AI</span>
                  <span className='truncate text-xs'>
                    Your AI Study Partner
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className='p-2'>
          <button
            onClick={handleNewChat}
            className='w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors duration-200'
          >
            <Plus className='w-4 h-4' />
            New Chat
          </button>
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || user?.phoneNumber || 'User',
            email: user?.email || '',
            avatar: user?.avatar || '/avatars/shadcn.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
