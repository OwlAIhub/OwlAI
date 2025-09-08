'use client';

import { useAuth } from '@/components/auth/providers/AuthProvider';
import { auth } from '@/lib/firebase';
import { userService } from '@/lib/services/userService';
import { signOut } from 'firebase/auth';
import { MessageSquare } from 'lucide-react';
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
  nav: [{ name: 'Chat Settings', icon: MessageSquare }],
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

  const { user } = useAuth();
  type Lang = 'en' | 'hi' | 'regional';
  type Exam = 'ugc-net' | 'csir-net' | 'ssc' | 'ctet' | 'other';
  const isLang = React.useCallback(
    (v: unknown): v is Lang =>
      typeof v === 'string' && ['en', 'hi', 'regional'].includes(v),
    []
  );
  const isExam = React.useCallback(
    (v: unknown): v is Exam =>
      typeof v === 'string' &&
      ['ugc-net', 'csir-net', 'ssc', 'ctet', 'other'].includes(v),
    []
  );
  const [displayName, setDisplayName] = React.useState('');
  const [photoURL, setPhotoURL] = React.useState('');
  const [language, setLanguage] = React.useState<Lang>('en');
  const [examType, setExamType] = React.useState<Exam>('ugc-net');
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Load current profile if available
    const load = async () => {
      if (!user?.id) return;
      try {
        const profile = await userService.getUserProfile(user.id);
        if (profile) {
          setDisplayName(profile.displayName || '');
          setPhotoURL(profile.photoURL || '');
          if (isLang(profile.preferences?.language))
            setLanguage(profile.preferences.language);
          if (isExam(profile.preferences?.examType))
            setExamType(profile.preferences.examType);
        }
      } catch {
        // noop
      }
    };
    load();
  }, [user?.id, isLang, isExam]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setStatus(null);
    try {
      await userService.updateUserProfile(user.id, {
        displayName,
        photoURL,
        preferences: {
          language,
          examType,
          studyLevel: 'beginner',
          notifications: {
            email: false,
            push: true,
            studyReminders: true,
          },
        },
      });
      setStatus('Saved');
    } catch {
      setStatus('Failed to save');
    } finally {
      setSaving(false);
    }
  };

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
                {/* Profile */}
                <div>
                  <h3 className='text-lg font-semibold mb-3'>Profile</h3>
                  <div className='space-y-3'>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='text-sm font-medium'>Display name</p>
                      <input
                        className='mt-1 w-full p-2 bg-background border rounded-md'
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        placeholder='Your name'
                      />
                    </div>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='text-sm font-medium'>Avatar URL</p>
                      <input
                        className='mt-1 w-full p-2 bg-background border rounded-md'
                        value={photoURL}
                        onChange={e => setPhotoURL(e.target.value)}
                        placeholder='https://...'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-lg font-semibold mb-3'>
                    Study Preferences
                  </h3>
                  <div className='space-y-3'>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='text-sm font-medium'>Language</p>
                      <select
                        className='mt-1 w-full p-2 bg-background border rounded-md'
                        value={language}
                        onChange={e => setLanguage(e.target.value as Lang)}
                      >
                        <option value='en'>English</option>
                        <option value='hi'>Hindi</option>
                        <option value='regional'>Regional</option>
                      </select>
                    </div>
                    <div className='p-3 bg-muted/30 rounded-lg'>
                      <p className='text-sm font-medium'>Exam</p>
                      <select
                        className='mt-1 w-full p-2 bg-background border rounded-md'
                        value={examType}
                        onChange={e => setExamType(e.target.value as Exam)}
                      >
                        <option value='ugc-net'>UGC NET</option>
                        <option value='csir-net'>CSIR NET</option>
                        <option value='ssc'>SSC</option>
                        <option value='ctet'>CTET</option>
                        <option value='other'>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    {status && <span>{status}</span>}
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className='px-3 py-2 rounded-md bg-teal-600 text-white text-sm disabled:opacity-50'
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => signOut(auth)}
                      className='px-3 py-2 rounded-md border text-sm'
                    >
                      Sign out
                    </button>
                  </div>
                </div>

                {/* Chat Preferences */}
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
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
