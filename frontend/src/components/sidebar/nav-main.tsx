'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import * as React from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      id?: string;
      title: string;
      url?: string;
      onClick?: () => void;
    }[];
  }[];
}) {
  // Memoize the items to prevent unnecessary re-renders
  const memoizedItems = React.useMemo(() => items, [items]);
  return (
    <SidebarGroup className='px-2'>
      <SidebarGroupLabel className='text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-2'>
        History
      </SidebarGroupLabel>
      <SidebarMenu className='space-y-1'>
        {memoizedItems.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                size='default'
                className='hover:bg-muted/60 transition-colors duration-150 group'
              >
                <a href={item.url} className='flex items-center gap-3 w-full'>
                  <div className='flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-150'>
                    <item.icon className='size-4' />
                  </div>
                  <span className='text-sm font-medium group-hover:text-foreground transition-colors duration-150'>
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className='data-[state=open]:rotate-90 hover:bg-muted/30 transition-all duration-150'>
                      <ChevronRight className='size-4' />
                      <span className='sr-only'>Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className='ml-4 space-y-1'>
                      {item.items?.map((subItem, index) => (
                        <SidebarMenuSubItem
                          key={subItem.id || `${subItem.title}-${index}`}
                          className='group'
                        >
                          <SidebarMenuSubButton
                            asChild
                            className='hover:bg-muted/60 transition-colors duration-150 rounded-md group'
                          >
                            <a
                              href={subItem.url || '#'}
                              onClick={e => {
                                if (subItem.onClick) {
                                  e.preventDefault();
                                  subItem.onClick();
                                }
                              }}
                              className='flex items-center gap-2.5 px-3 py-2.5 w-full'
                            >
                              <span className='text-xs truncate group-hover:text-foreground transition-colors duration-150'>
                                {subItem.title}
                              </span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
