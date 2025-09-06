import { ChatInterface } from '@/components/chat_interface';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/sidebar/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const iframeHeight = '800px';

export const description = 'A sidebar with a header and a search form.';

export default function Page() {
  return (
    <div className='[--header-height:calc(--spacing(14))] h-screen overflow-hidden'>
      <SidebarProvider className='flex flex-col h-full'>
        <SiteHeader />
        <div className='flex flex-1 overflow-hidden'>
          <AppSidebar />
          <SidebarInset className='bg-background flex-1 overflow-hidden'>
            <ChatInterface />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
