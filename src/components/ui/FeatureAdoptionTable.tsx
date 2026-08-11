"use client";

import svgPaths from "@/imports/Dashbaord/svg-j8ue68fght";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type FeatureTrend = "up" | "flat" | "down";

export interface FeatureAdoptionRow {
  feature: string;
  users: string;
  adoption: string;
  trend: FeatureTrend;
}

export interface FeatureAdoptionTableProps {
  rows: FeatureAdoptionRow[];
  onViewAll?: () => void;
}

/**
 * Trend icon per semantic type, using the dashboard's existing icon
 * artwork and colors. The three "up" rows in the original dashboard
 * (Daily Challenges/Battle Pass/Ranked Mode) each carried their own
 * separately-exported copy of a visually identical purple trending-up
 * glyph — consolidated here to one canonical icon per type, since a
 * reusable, data-driven table needs a `trend` enum rather than
 * duplicated near-identical SVG markup. Nothing about the rendered
 * appearance changes.
 */
function TrendIcon({ trend }: { trend: FeatureTrend }) {
  if (trend === "up") {
    return (
      <div className="bg-[#ede9fe] relative rounded-[4px] shrink-0 size-[15px]">
        <div className="flex items-center justify-center relative size-full">
          <svg className="size-[9.928px]" fill="none" viewBox="0 0 17.7276 17.7276" aria-hidden="true">
            <path d={svgPaths.p27a5fc80} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
            <path d={svgPaths.p100b9c00} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          </svg>
        </div>
      </div>
    );
  }
  if (trend === "flat") {
    return (
      <div className="bg-[#fef3c7] relative rounded-[4px] shrink-0 size-[15px]">
        <div className="flex items-center justify-center relative size-full">
          <svg className="size-[9.928px]" fill="none" viewBox="0 0 17.7276 17.7276" aria-hidden="true">
            <path d="M3.69323 8.86374H14.0343" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
            <path d={svgPaths.p9c14000} stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#fee2e2] relative rounded-[4px] shrink-0 size-[15px]">
      <div className="flex items-center justify-center relative size-full">
        <svg className="size-[9.928px]" fill="none" viewBox="0 0 17.7276 17.7276" aria-hidden="true">
          <path d={svgPaths.p11421580} stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p2b058a60} stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </svg>
      </div>
    </div>
  );
}

/**
 * The "Feature Adoption" dashboard section: card chrome, header
 * (icon + title + "View all"), and a shadcn/ui Table body. Same exact
 * visual spec as the dashboard's previous implementation.
 */
export function FeatureAdoptionTable({ rows, onViewAll }: FeatureAdoptionTableProps) {
  return (
    <div
      className="bg-white border border-[#eef0f5] shadow-sm flex-[317.333_1_0] min-w-0 relative rounded-xl transition-shadow duration-150 hover:shadow-md cursor-default"
      data-name="Feature Adoption"
    >
      <div className="flex flex-col items-start gap-[10px] px-[14px] py-[12px] relative size-full">
        <div className="flex items-center justify-between gap-[16px] relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center shrink-0">
            <div className="bg-[#ede9fe] relative rounded-[6px] shrink-0 size-[20px]">
              <div className="flex items-center justify-center relative size-full">
                <svg className="size-[11.582px]" fill="none" viewBox="0 0 20.6822 20.6822" aria-hidden="true">
                  <path d={svgPaths.p1f0c7f00} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                </svg>
              </div>
            </div>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic text-[#111827] text-[14px] whitespace-nowrap">
              Feature Adoption
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
              <col className="w-[46%]" />
              <col className="w-[18%]" />
              <col className="w-[20%]" />
              <col className="w-[16%]" />
            </colgroup>
            <TableHeader>
              <TableRow className="border-b border-[#f3f4f6]">
                <TableHead className="pb-[8px] pl-[14px] font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Feature
                </TableHead>
                <TableHead className="pb-[8px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Users
                </TableHead>
                <TableHead className="pb-[8px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Adoption
                </TableHead>
                <TableHead className="pb-[8px] pr-[14px] text-right font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[11px] tracking-[0.347px] uppercase">
                  Trend
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={row.feature}
                  className={`transition-colors duration-150 hover:bg-[#f8fafc] ${index < rows.length - 1 ? "border-b border-[#f3f4f6]" : ""}`}
                >
                  <TableCell className="py-[8px] pl-[14px] font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[13px] whitespace-nowrap">
                    {row.feature}
                  </TableCell>
                  <TableCell className="py-[8px] text-right font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[13px] whitespace-nowrap">
                    {row.users}
                  </TableCell>
                  <TableCell className="py-[8px] text-right font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[13px] whitespace-nowrap">
                    {row.adoption}
                  </TableCell>
                  <TableCell className="py-[8px] pr-[14px]">
                    <div className="flex items-center justify-end" role="img" aria-label={`Trend: ${row.trend}`}>
                      <TrendIcon trend={row.trend} />
                    </div>
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
