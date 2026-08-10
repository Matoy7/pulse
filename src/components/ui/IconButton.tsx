import { forwardRef } from "react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ComponentProps<typeof Button>, "size" | "children"> {
  /** The icon to render, e.g. <Settings className="size-4" /> from lucide-react. */
  icon: ReactNode;
  /** Required — this button has no visible text, so it needs an accessible name. */
  "aria-label": string;
}

/**
 * An icon-only button, built on the shadcn/ui Button foundation
 * (https://ui.shadcn.com/docs/components/base/button). Defaults to the
 * `outline` variant to match the dashboard's existing header icon
 * buttons — clean white background, subtle border, subtle hover.
 * Hover, focus-visible, and disabled states all come from Button.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = "outline", className, ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} size="icon" className={cn(className)} {...props}>
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
