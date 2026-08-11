"use client";

import svgPaths from "@/imports/Dashbaord/svg-j8ue68fght";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export interface PopularScreenRow {
  screen: string;
  views: string;
  avgTime: string;
  exitRate: string;
  /** Matches the existing dashboard's two indicator colors — no new colors introduced. */
  indicatorColor: "purple" | "yellow";
}

export interface PopularScreensTableProps {
  rows: PopularScreenRow[];
  /** Called when "View all" is clicked. Omit to render it as a non-interactive label-only affordance. */
  onViewAll?: () => void;
}

const INDICATOR_CLASS: Record<PopularScreenRow["indicatorColor"], string> = {
  // #7b6cf5 is this project's existing --color-primary token.
  purple: "bg-primary",
  // #f5c53a is an existing dashboard color with no semantic token yet —
  // preserved as-is rather than invented or normalized in this phase.
  yellow: "bg-[#f5c53a]",
};

/**
 * The "Popular Screens" dashboard section: card chrome, header
 * (icon + title + "View all"), and a shadcn/ui Table body. Extracted
 * from the dashboard's previous div/CSS-grid implementation — same
 * exact visual spec (colors, spacing, row height, hover), now built on
 * semantic <table> markup via the shared Table primitives.
 */
export function PopularScreensTable({ rows, onViewAll }: PopularScreensTableProps) {
  return (
    <div
      className="bg-white border border-[#eef0f5] shadow-sm flex-[317.333_1_0] min-w-0 relative rounded-xl transition-shadow duration-150 hover:shadow-md cursor-default"
      data-name="Popular Screens"
    >
      <div className="flex flex-col items-start gap-[10px] px-[14px] py-[12px] relative size-full">
        <div className="flex items-center justify-between gap-[16px] relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center shrink-0">
            <div className="bg-[#ede9fe] relative rounded-[6px] shrink-0 size-[20px]">
              <div className="flex items-center justify-center relative size-full">
                <svg className="size-[11.582px]" fill="none" viewBox="0 0 20.6822 20.6822" aria-hidden="true">
                  <path d={svgPaths.p107e3f60} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                  <path d="M6.89407 18.0969H13.7881" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                  <path d="M10.3411 14.65V18.0971" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                </svg>
              </div>
            </div>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic text-[#111827] text-[18px] whitespace-nowrap">
              Popular Screens
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="shrink-0 cursor-pointer text-left font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic text-[#7b6cf5] text-[13px] whitespace-nowrap transition-colors duration-150 hover:text-[#4c2e9e] underline-offset-2 hover:underline"
          >
            View all
          </button>
        </div>

        <div className="-mx-[14px] w-[calc(100%+28px)]">
          <Table>
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b border-[#f3f4f6]">
                <TableHead className="pb-[8px] pl-[14px] font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Screen
                </TableHead>
                <TableHead className="pb-[8px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Views
                </TableHead>
                <TableHead className="pb-[8px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Avg Time
                </TableHead>
                <TableHead className="pb-[8px] pr-[14px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Exit Rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.screen}
                  className={`transition-colors duration-150 hover:bg-[#f8fafc] ${index < rows.length - 1 ? "border-b border-[#f3f4f6]" : ""}`}
                >
                  <TableCell className="py-[8px] pl-[14px]">
                    <div className="flex gap-[10px] items-center min-w-0">
                      <div
                        aria-hidden="true"
                        className={`h-[3.5px] opacity-85 relative rounded-[2px] shrink-0 w-[18px] ${INDICATOR_CLASS[row.indicatorColor]}`}
                      />
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic text-[#374151] text-[13px] whitespace-nowrap min-w-0">
                        {row.screen}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-[8px] text-right font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[13px] whitespace-nowrap">
                    {row.views}
                  </TableCell>
                  <TableCell className="py-[8px] text-right font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[13px] whitespace-nowrap">
                    {row.avgTime}
                  </TableCell>
                  <TableCell className="py-[8px] pr-[14px] text-right font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[13px] whitespace-nowrap">
                    {row.exitRate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
