'use client';

import { SidebarIcon } from 'lucide-react';
import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  const handleToggleSidebar = React.useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <header className='sticky top-0 z-50 flex w-full items-center border-b border-sidebar-border bg-sidebar'>
      <div className='flex h-10 w-full items-center gap-1 sm:gap-2 px-2 sm:px-3'>
        <Button
          className='h-6 w-6 sm:h-7 sm:w-7 hover:bg-muted/50 transition-colors duration-150'
          variant='ghost'
          size='icon'
          onClick={handleToggleSidebar}
          aria-label='Toggle sidebar'
        >
          <SidebarIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
        </Button>
        <Separator
          orientation='vertical'
          className='mr-1 h-4 bg-sidebar-border'
        />
        <Breadcrumb className='hidden md:block'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href='#'
                className='text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-transparent hover:no-underline transition-colors duration-150 text-xs font-medium [&:hover]:text-sidebar-accent-foreground [&:hover]:bg-transparent'
              >
                OWL AI Chat
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='text-sidebar-foreground/70 text-xs font-medium'>
                Conversation
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
