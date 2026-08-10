"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Trimmed shadcn/ui Dropdown Menu, adapted to this project's design
 * tokens. Reference: https://ui.shadcn.com/docs/components/base/dropdown-menu
 *
 * Only the pieces a single-select menu (like DateRangeSelector) needs
 * are included: Root, Trigger, Content, RadioGroup, RadioItem. shadcn's
 * plain Item, Label, Separator, Checkbox items, and Sub-menu pieces
 * aren't used by anything yet and were left out — they can be added
 * later following the same official reference if a future component
 * needs them.
 */

function DropdownMenu(props: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-md border border-border-strong bg-surface p-1 text-foreground shadow-md",
          "data-[state=open]:animate-[dropdownOpen_150ms_ease-out] origin-(--radix-dropdown-menu-content-transform-origin)",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuRadioGroup(
  props: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>
) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:bg-surface-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4 text-primary" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};
