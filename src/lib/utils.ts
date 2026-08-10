import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts (e.g. a later `px-4`
 * winning over an earlier `px-2`) the way shadcn/ui components expect.
 * Standard shadcn/ui foundation utility — used by every component built
 * on the shadcn pattern (Button, DropdownMenu, etc.) to combine their
 * own variant classes with a caller-supplied `className` override.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
