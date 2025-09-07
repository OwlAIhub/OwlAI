'use client';

import {
  Globe,
  Keyboard,
  MessageSquare,
  Palette,
  Settings,
  Shield,
  User,
  Volume2,
} from 'lucide-react';
import * as React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/modals/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

const data = {
  nav: [
    { name: 'Chat Settings', icon: MessageSquare },
    { name: 'Profile', icon: User },
    { name: 'Appearance', icon: Palette },
    { name: 'Language', icon: Globe },
    { name: 'Privacy', icon: Shield },
    { name: 'Audio', icon: Volume2 },
    { name: 'Accessibility', icon: Keyboard },
    { name: 'Advanced', icon: Settings },
  ],
};

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function SettingsDialog({
  open,
  onOpenChange,
  trigger,
}: SettingsDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
        <DialogTitle className='sr-only'>Settings</DialogTitle>
        <DialogDescription className='sr-only'>
          Customize your settings here.
        </DialogDescription>
        <SidebarProvider className='items-start'>
          <Sidebar collapsible='none' className='hidden md:flex'>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map(item => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === 'Chat Settings'}
                        >
                          <a href='#'>
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className='flex h-[480px] flex-1 flex-col overflow-hidden'>
            <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
              <div className='flex items-center gap-2 px-4'>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className='hidden md:block'>
                      <BreadcrumbLink href='#'>Settings</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='hidden md:block' />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Chat Settings</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Chat Preferences
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                      <div>
                        <p className='font-medium'>Auto-save conversations</p>
                        <p className='text-sm text-muted-foreground'>
                          Automatically save your chat history
                        </p>
                      </div>
                      <div className='w-12 h-6 bg-primary rounded-full relative'>
                        <div className='w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5'></div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                      <div>
                        <p className='font-medium'>Typing indicators</p>
                        <p className='text-sm text-muted-foreground'>
                          Show when AI is typing
                        </p>
                      </div>
                      <div className='w-12 h-6 bg-muted rounded-full relative'>
                        <div className='w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Study Preferences
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                      <div>
                        <p className='font-medium'>Study reminders</p>
                        <p className='text-sm text-muted-foreground'>
                          Get notifications for study sessions
                        </p>
                      </div>
                      <div className='w-12 h-6 bg-primary rounded-full relative'>
                        <div className='w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5'></div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'>
                      <div>
                        <p className='font-medium'>Progress tracking</p>
                        <p className='text-sm text-muted-foreground'>
                          Track your learning progress
                        </p>
                      </div>
                      <div className='w-12 h-6 bg-primary rounded-full relative'>
                        <div className='w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5'></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-3'>AI Behavior</h3>
                  <div className='space-y-3'>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='font-medium mb-2'>Response style</p>
                      <select className='w-full p-2 bg-background border rounded-md'>
                        <option>Friendly and encouraging</option>
                        <option>Professional and direct</option>
                        <option>Detailed and thorough</option>
                      </select>
                    </div>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='font-medium mb-2'>Study level</p>
                      <select className='w-full p-2 bg-background border rounded-md'>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
