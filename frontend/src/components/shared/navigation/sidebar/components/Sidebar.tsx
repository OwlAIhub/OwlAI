"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar, SIDEBAR_WIDTH_MOBILE } from "../context/SidebarContext";

interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      data-slot="sidebar"
      data-side={side}
      data-variant={variant}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-state={state}
      className={cn(
        "bg-sidebar text-sidebar-foreground group/sidebar relative h-full w-(--sidebar-width) transition-all duration-300 ease-in-out group-data-[collapsible=offcanvas]:translate-x-[var(--sidebar-offset)]",
        side === "right" &&
          "group-data-[collapsible=offcanvas]:translate-x-[calc(100%+var(--sidebar-offset))]",
        variant === "floating" &&
          "absolute inset-y-0 z-10 ml-2 h-[calc(100%-theme(space.4))] w-[calc(var(--sidebar-width)-theme(space.4))] rounded-lg border border-border/60 bg-background/95 shadow-lg backdrop-blur-sm",
        variant === "inset" &&
          "relative z-10 h-[calc(100%-theme(space.4))] w-[calc(var(--sidebar-width)-theme(space.4))] bg-transparent",
        collapsible === "icon" && "group-data-[state=collapsed]:w-(--sidebar-width-icon)",
        state === "collapsed" &&
          collapsible === "offcanvas" &&
          "group-data-[collapsible=offcanvas]:w-0",
        className,
      )}
      {...props}
    >
      <div
        data-sidebar="sidebar"
        className="flex h-full w-full flex-col group-data-[collapsible=icon]:overflow-hidden group-data-[state=collapsed]:overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
}