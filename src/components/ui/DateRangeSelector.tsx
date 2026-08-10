"use client";

import { useState } from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "@/lib/utils";

export interface DateRangeOption {
  value: string;
  label: string;
}

export const DEFAULT_DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

export interface DateRangeSelectorProps {
  /** Available options. Defaults to the standard 24h/7d/30d/90d set. */
  options?: DateRangeOption[];
  /** Selected value, for controlled usage. Omit to let the component manage its own state. */
  value?: string;
  /** Called whenever the user picks a different option. */
  onValueChange?: (value: string) => void;
  /** Initial selected value when uncontrolled. Defaults to the first option. */
  defaultValue?: string;
  /** Renders the menu open on mount — useful for Storybook / visual review, not meant for normal use. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * A labeled dropdown for picking a date range. Not wired to any
 * dashboard data — purely a reusable, self-contained UI component.
 * Built on the shadcn/ui Dropdown Menu foundation
 * (https://ui.shadcn.com/docs/components/base/dropdown-menu).
 */
export function DateRangeSelector({
  options = DEFAULT_DATE_RANGE_OPTIONS,
  value,
  onValueChange,
  defaultValue,
  defaultOpen,
  className = "",
}: DateRangeSelectorProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? options[0]?.value);
  const selected = value ?? internalValue;
  const selectedLabel = options.find((option) => option.value === selected)?.label ?? options[0]?.label;

  function handleChange(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            // h-control: same shared height token IconButton uses, so the
            // two always match exactly regardless of this button's own
            // text line-height. Width stays content-driven (px-3 + the
            // label) — only height is pinned, per the fixed requirement
            // that width may differ but height must be identical.
            "inline-flex h-control items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            className
          )}
        >
          <CalendarIcon className="size-4 text-foreground-muted" aria-hidden="true" />
          <span>{selectedLabel}</span>
          <ChevronDownIcon className="size-4 text-foreground-muted" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={selected} onValueChange={handleChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
