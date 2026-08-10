import type { ReactNode } from "react";

export interface KpiCardProps {
  /** KPI label shown at the top of the card, e.g. "Revenue". */
  title: string;
  /** Headline value, already formatted by the caller, e.g. "$84,200". */
  value: string;
  /** Supporting caption under the value, e.g. "Total evenue". */
  caption: string;
  /**
   * Decorative sparkline chart rendered at the bottom of the card.
   * Each KPI's sparkline is unique artwork (its own SVG path + gradient),
   * so it's supplied via composition rather than baked into this
   * component — KpiCard stays generic and has no knowledge of any
   * specific KPI's chart data.
   */
  chart: ReactNode;
  /**
   * Optional passthrough for classes the parent layout needs to apply
   * (e.g. CSS Grid placement like "col-2 row-1 self-stretch"). KpiCard
   * has no opinion on where it sits in a layout.
   */
  className?: string;
}

/**
 * A single KPI stat card: title, headline value, caption, and a
 * decorative sparkline chart. Used four times on the dashboard
 * (Revenue, DAU, Average Session, Drop Off Rate) — extracted from four
 * previously-duplicated implementations that were visually identical
 * apart from their content.
 */
export function KpiCard({ title, value, caption, chart, className = "" }: KpiCardProps) {
  return (
    <div
      className={`bg-white drop-shadow-[0px_0.767px_3.07px_rgba(0,0,0,0.06)] relative rounded-[10.745px] transition-shadow duration-200 hover:shadow-[0px_6px_16px_-2px_rgba(15,23,42,0.12)] cursor-default ${className}`}
      data-name="StatCard"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[14px] items-start pb-[16px] pt-[16px] px-[16px] relative size-full">
        <div className="relative shrink-0 w-full" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center gap-[8px] relative w-full">
            <div className="relative shrink-0 flex items-start w-full" data-name="Text">
              <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic text-[#131b2e] text-[16px] whitespace-nowrap relative shrink-0">
                {title}
              </p>
            </div>
          </div>
        </div>

        <div className="relative shrink-0" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2.295px] items-start overflow-clip relative rounded-[inherit] size-full">
            <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[18.573px] not-italic relative shrink-0 text-[#111827] text-[22.952px] tracking-[-0.507px] whitespace-nowrap transition-opacity duration-200">
              {value}
            </p>
            <div className="relative shrink-0" data-name="Text">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
                <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">
                  {caption}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[46px] overflow-hidden rounded-[6px] shrink-0" data-name="Group">
          {chart}
        </div>
      </div>
    </div>
  );
}
