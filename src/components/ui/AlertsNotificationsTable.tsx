"use client";

import { useState } from "react";
import svgPaths from "@/imports/Dashbaord/svg-j8ue68fght";
import { Table, TableBody, TableCell, TableRow } from "./table";

export type AlertType = "positive" | "warning" | "negative";

export interface AlertRow {
  /** Stable identifier, used as the React key and to track expand/collapse state. */
  id: string;
  message: string;
  timestamp: string;
  type: AlertType;
  /** Optional detail shown when the row is expanded. Rows without one aren't expandable. */
  detail?: string;
}

export interface AlertsNotificationsTableProps {
  alerts: AlertRow[];
  onViewAll?: () => void;
}

const TYPE_STYLES: Record<AlertType, { bg: string; stroke: string; dot: string }> = {
  positive: { bg: "bg-[#ede9fe]", stroke: "#7B6CF5", dot: "bg-primary" },
  warning: { bg: "bg-[#fef3c7]", stroke: "#F59E0B", dot: "bg-[#f59e0b]" },
  negative: { bg: "bg-[#fee2e2]", stroke: "#EF4444", dot: "bg-[#ef4444]" },
};

/**
 * Alert-type icon. "positive" reuses the dashboard's existing
 * trending-up glyph (the same icon three different rows in the
 * original dashboard each carried their own separately-exported but
 * visually identical copy of — consolidated to one canonical icon
 * here, same as FeatureAdoptionTable's "up" trend icon). "warning" and
 * "negative" use their own existing distinct glyphs.
 */
function AlertIcon({ type }: { type: AlertType }) {
  const { bg, stroke } = TYPE_STYLES[type];
  return (
    <div className={`${bg} relative rounded-[5px] shrink-0 size-[18px]`}>
      <div className="flex items-center justify-center relative size-full">
        <svg className="size-[10.755px]" fill="none" viewBox="0 0 19.2049 19.2049" aria-hidden="true">
          {type === "positive" && (
            <>
              <path d={svgPaths.p1430c180} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
              <path d={svgPaths.p6c19500} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
            </>
          )}
          {type === "warning" && (
            <>
              <path d={svgPaths.p16f47800} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
              <path d="M9.60244 7.20175V10.4026" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
              <path d="M9.60244 13.6032H9.61038" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
            </>
          )}
          {type === "negative" && (
            <>
              <path d={svgPaths.p21e5bf00} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
              <path d={svgPaths.p25499700} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

/**
 * The "Alerts & Notifications" dashboard section: card chrome, header
 * (icon + title + "View all"), and a shadcn/ui Table body — one row
 * per alert, click-to-expand for an optional detail line. Same exact
 * visual spec and interaction as the dashboard's previous
 * implementation; only the markup is now table-semantic.
 */
export function AlertsNotificationsTable({ alerts, onViewAll }: AlertsNotificationsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div
      className="bg-white border border-[#eef0f5] shadow-sm flex-[317.333_1_0] min-w-0 relative rounded-xl transition-shadow duration-150 hover:shadow-md cursor-default"
      data-name="Alerts & Notifications"
    >
      <div className="flex flex-col items-start gap-[10px] px-[14px] py-[12px] relative size-full">
        <div className="flex items-center justify-between gap-[16px] relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center shrink-0">
            <div className="bg-[#ede9fe] relative rounded-[6px] shrink-0 size-[20px]">
              <div className="flex items-center justify-center relative size-full">
                <svg className="size-[11.582px]" fill="none" viewBox="0 0 20.6822 20.6822" aria-hidden="true">
                  <path d={svgPaths.p33303f00} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                  <path d={svgPaths.p3706e780} stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
                </svg>
              </div>
            </div>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] not-italic text-[#111827] text-[14px] whitespace-nowrap">
              Alerts &amp; Notifications
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
            <TableBody>
              {alerts.map((alert, index) => {
                const expanded = expandedIds.has(alert.id);
                const isLast = index === alerts.length - 1;
                return (
                  <TableRow key={alert.id} className={isLast ? "" : "border-b border-[#f3f4f6]"}>
                    <TableCell className="p-0" colSpan={3}>
                      <button
                        type="button"
                        onClick={() => alert.detail && toggle(alert.id)}
                        aria-expanded={alert.detail ? expanded : undefined}
                        className="flex gap-[12px] items-center pb-[8px] pt-[8px] pl-[14px] pr-[14px] relative w-full cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
                      >
                        <AlertIcon type={alert.type} />
                        <div className="flex-1 min-w-0">
                          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic text-[#374151] text-[13px] min-w-0 w-full">
                            {alert.message}
                          </p>
                        </div>
                        <div className="flex gap-[8px] items-center shrink-0">
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic text-[#9ca3af] text-[11px] whitespace-nowrap">
                            {alert.timestamp}
                          </p>
                          <span
                            aria-hidden="true"
                            className={`${TYPE_STYLES[alert.type].dot} relative rounded-full shrink-0 size-[5px]`}
                          />
                        </div>
                      </button>
                      {expanded && alert.detail && (
                        <div className="pb-[12px] pr-[8px] pl-[52px]">
                          <p className="text-[14px] leading-[20px] text-[#6b7280]">{alert.detail}</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
