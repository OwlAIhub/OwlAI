'use client';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import { useState } from 'react';

import { AccountModal } from '@/components/ui/account-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='default'
              className='data-[state=open]:bg-muted data-[state=open]:text-foreground hover:bg-muted/50 transition-colors duration-150'
            >
              <Avatar className='h-8 w-8 rounded-md'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='rounded-md bg-primary text-primary-foreground text-xs font-medium'>
                  GU
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium text-foreground'>
                  {user.name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto size-4 text-muted-foreground' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-3 px-2 py-2 text-left'>
                <Avatar className='h-9 w-9 rounded-lg'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='rounded-lg text-sm font-medium'>
                    GU
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left leading-tight'>
                  <span className='truncate font-medium text-sm'>
                    {user.name}
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className='text-sm cursor-pointer'
                onClick={() => setIsAccountModalOpen(true)}
              >
                <BadgeCheck className='size-4' />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-sm text-destructive hover:text-destructive/80 hover:bg-destructive/10 focus:text-destructive/80 focus:bg-destructive/10 transition-colors duration-150'>
              <LogOut className='size-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Account Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
      />
    </SidebarMenu>
  );
}
