'use client';

import type { LucideIcon } from 'lucide-react';
import { MessageSquare, Plus, SquareTerminal } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { setCurrentChatId } from '@/lib/chats';
import { getGuestId } from '@/lib/guest';
import { subscribeToChatsForGuest, type ChatListItem } from '@/lib/realtime';
import { useRouter } from 'next/navigation';

type NavSubItem = {
  title: string;
  url?: string;
  onClick?: () => void;
};
type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

const data: {
  user: { name: string; email: string; avatar: string };
  navMain: NavItem[];
} = {
  user: {
    name: 'Guest User',
    email: 'guest@owlai.com',
    avatar: '/owl-ai-logo.png',
  },
  navMain: [
    {
      title: 'Chat',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [chats, setChats] = React.useState<ChatListItem[]>([]);
  const [navItems, setNavItems] = React.useState<NavItem[]>(data.navMain);
  const [currentChatTitle, setCurrentChatTitle] =
    React.useState<string>('New Chat');

  // Optimize chat subscription with useCallback
  const handleChatsUpdate = React.useCallback((items: ChatListItem[]) => {
    setChats(items);
  }, []);

  React.useEffect(() => {
    const gid = getGuestId();
    if (!gid) return;
    const unsub = subscribeToChatsForGuest(gid, handleChatsUpdate);
    return () => unsub();
  }, [handleChatsUpdate]);

  // Optimize nav items update with useMemo
  const optimizedNavItems = React.useMemo(() => {
    const chatMenu = data.navMain[0];
    const historyItems: NavSubItem[] = chats.map(c => ({
      id: c.id,
      title: c.title || 'Untitled Chat',
      onClick: () => {
        setCurrentChatId(c.id);
        router.push('/chat');
        // notify chat interface to switch subscription
        const ev = new CustomEvent('chat:switched', {
          detail: { chatId: c.id },
        });
        document.dispatchEvent(ev);
      },
    }));

    return [{ ...chatMenu, items: historyItems }];
  }, [chats, router]);

  React.useEffect(() => {
    setNavItems(optimizedNavItems);
  }, [optimizedNavItems]);

  // Listen for chat changes to update breadcrumb
  React.useEffect(() => {
    const handleChatSwitched = (e: CustomEvent) => {
      const { chatId } = e.detail;
      if (chatId) {
        const chat = chats.find(c => c.id === chatId);
        setCurrentChatTitle(chat?.title || 'Untitled Chat');
      } else {
        setCurrentChatTitle('New Chat');
      }
    };

    document.addEventListener(
      'chat:switched',
      handleChatSwitched as EventListener
    );
    return () => {
      document.removeEventListener(
        'chat:switched',
        handleChatSwitched as EventListener
      );
    };
  }, [chats]);

  return (
    <Sidebar
      className='h-screen bg-sidebar border-r border-border/50'
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='sm' asChild>
              <a
                href='#'
                className='hover:bg-muted/50 transition-colors duration-150'
              >
                <div className='bg-primary text-primary-foreground flex aspect-square size-6 items-center justify-center rounded-md'>
                  <Image
                    src='/owl-ai-logo.png'
                    alt='OWL AI'
                    width={16}
                    height={16}
                    className='size-4'
                  />
                </div>
                <div className='grid flex-1 text-left text-xs leading-tight'>
                  <span className='truncate font-medium text-foreground'>
                    OWL AI
                  </span>
                  <span className='truncate text-[10px] text-muted-foreground'>
                    Study Assistant
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Breadcrumb */}
        <div className='px-3 py-2 border-t border-border/50'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <MessageSquare className='w-4 h-4' />
            <span className='truncate font-medium text-foreground'>
              {currentChatTitle}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className='px-4 py-3'>
          <button
            type='button'
            className='w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 flex items-center gap-2.5 justify-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 min-h-[44px]'
            onClick={React.useCallback(() => {
              // Show welcome screen for new chat
              if (typeof window !== 'undefined') {
                localStorage.removeItem('currentChatId');
                // Use existing chat:switched event with a special flag
                document.dispatchEvent(
                  new CustomEvent('chat:switched', {
                    detail: { chatId: null, showEmptyChat: true },
                  })
                );
              }
            }, [])}
            aria-label='Create new chat'
          >
            <Plus className='size-4' />
            New Chat
          </button>
        </div>

        {/* Chat history is rendered in NavMain dropdown now */}

        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
