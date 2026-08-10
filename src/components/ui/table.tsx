import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Table primitives, adapted to this project's design tokens.
 * Reference: https://ui.shadcn.com/docs/components/base/table
 *
 * Deliberately minimal base styling — each consuming component (e.g.
 * PopularScreensTable) supplies its own precise padding/border/hover
 * classes on TableRow/TableHead/TableCell to reproduce the dashboard's
 * exact existing visual spec. The primitives here only provide the
 * correct semantic HTML structure (table/thead/tbody/tr/th/td) and a
 * few structural defaults (full width, border-collapse-like behavior,
 * horizontal scroll containment) — not opinions about row height or
 * cell padding, since those already have an established, specific
 * design in this project that must be preserved exactly.
 */

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn(className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn(className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn(className)} {...props} />;
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={cn("text-left align-middle font-medium", className)} {...props} />;
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("align-middle", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
