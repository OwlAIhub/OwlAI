'use client';

import { ChatInterface } from '@/components/chat_interface';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function Page() {
  return (
    <div className='h-screen overflow-hidden'>
      <SidebarProvider className='flex h-full'>
        <AppSidebar />
        <SidebarInset className='bg-background flex-1 overflow-hidden'>
          <ChatInterface />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
