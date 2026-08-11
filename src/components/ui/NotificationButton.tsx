import { BellIcon } from "lucide-react";
import { IconButton } from "./IconButton";
import { cn } from "@/lib/utils";

export interface NotificationButtonProps {
  /** Unread notification count. 0 (the default) hides the badge entirely. */
  count?: number;
  /** Base accessible label, before the unread count is appended. */
  "aria-label"?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * A notification bell icon button with an unread-count badge. Built by
 * composing IconButton with a small badge indicator — not connected to
 * any real notification data.
 */
export function NotificationButton({
  count = 0,
  "aria-label": ariaLabel = "Notifications",
  className = "",
  onClick,
}: NotificationButtonProps) {
  const hasUnread = count > 0;
  const displayCount = count > 99 ? "99+" : String(count);
  const fullLabel = hasUnread ? `${ariaLabel} (${displayCount} unread)` : ariaLabel;

  return (
    <span className={cn("relative inline-flex", className)}>
      <IconButton
        icon={<BellIcon className="size-[24px]" aria-hidden="true" />}
        aria-label={fullLabel}
        onClick={onClick}
      />
      {hasUnread && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 block size-[10.4px] rounded-full bg-[#fae07a] ring-2 ring-white"
        />
      )}
    </span>
  );
}
