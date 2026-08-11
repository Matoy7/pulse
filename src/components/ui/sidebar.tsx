"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Sidebar, adapted to this project's exact existing sidebar
 * styling. Reference: https://ui.shadcn.com/docs/components/base/sidebar
 *
 * The official component is one of shadcn's largest — it includes a
 * mobile off-canvas Sheet, a collapsible icon-only mode with
 * tooltips, a resize rail, a toggle trigger, and CSS-variable-driven
 * theming (--sidebar, --sidebar-primary, etc). This dashboard is
 * desktop-only (an existing, explicit project constraint) and has no
 * collapse/toggle affordance anywhere in its UI, so those pieces
 * aren't included here — only what's actually used: the context
 * provider, the structural slots (Header/Content/Group/Footer), and
 * the menu primitives. This mirrors how every other shadcn primitive
 * in this project (button, dropdown-menu, chart, table) was trimmed
 * to its actual call sites rather than ported in full.
 *
 * Colors are the sidebar's own existing exact values (bg-[#fafafa],
 * the #e0d8f3/#623ec4 active state, etc.) rather than shadcn's default
 * --sidebar-* CSS variable theme, since this project already has one
 * design-token system (src/styles/tokens.css) and duplicating it with
 * a second, sidebar-specific one isn't warranted for a single static
 * panel with bespoke colors.
 */

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div data-slot="sidebar-wrapper" className={cn("flex h-full w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="sidebar" className={cn("flex h-full flex-col shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-header" className={cn("flex flex-col shrink-0", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-footer" className={cn("flex flex-col shrink-0", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-[8px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group" className={cn("relative flex w-full min-w-0 flex-col", className)} {...props} />;
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="sidebar-group-content" className={cn("w-full", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-[4px] list-none m-0 p-0", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props} />;
}

const sidebarMenuButtonVariants = cva(
  "flex h-[36px] w-full cursor-pointer items-center gap-[10px] overflow-hidden rounded-[10px] px-[10px] py-[8px] text-left text-[14px] outline-none transition-colors duration-150",
  {
    variants: {
      isActive: {
        true: "bg-[#e0d8f3] font-semibold text-[#623ec4] hover:bg-[#d5c9ef]",
        false: "font-normal text-[#1e293b] hover:bg-[#f4f2fb] hover:text-[#623ec4]",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export interface SidebarMenuButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ asChild = false, isActive = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ isActive }), className)}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
