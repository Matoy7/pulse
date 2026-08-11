import { AreaSparkline } from "./AreaSparkline";

export interface KpiCardProps {
  /** KPI label shown at the top of the card, e.g. "Revenue". */
  title: string;
  /** Headline value, already formatted by the caller, e.g. "$84,200". */
  value: string;
  /** Supporting caption under the value, e.g. "Total revenue". */
  caption: string;
  /**
   * Ordered numeric trend data rendered as a compact area sparkline at
   * the bottom of the card, e.g. [38, 42, 40, 47, 51, 49, 58, 62].
   * KpiCard is fully data-driven for its chart — it owns rendering the
   * sparkline itself (via AreaSparkline) rather than accepting an
   * arbitrary ReactNode, so every KPI card automatically gets the same
   * chart treatment and there's no per-instance SVG artwork to keep in
   * sync.
   */
  sparklineData: number[];
  /**
   * Optional passthrough for classes the parent layout needs to apply
   * (e.g. CSS Grid placement like "col-2 row-1 self-stretch"). KpiCard
   * has no opinion on where it sits in a layout.
   */
  className?: string;
}

/**
 * A single KPI stat card: title, headline value, caption, and a
 * compact area-sparkline trend chart. Used four times on the dashboard
 * (Revenue, DAU, Average Session, Drop Off Rate) — extracted from four
 * previously-duplicated implementations that were visually identical
 * apart from their content.
 */
export function KpiCard({ title, value, caption, sparklineData, className = "" }: KpiCardProps) {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg relative transition-shadow duration-150 hover:shadow-md cursor-default ${className}`}
      data-name="StatCard"
    >
      <div className="flex flex-col gap-[12px] items-start p-[16px] relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[#131b2e] text-[18px] whitespace-nowrap relative shrink-0">
          {title}
        </p>

        <div className="flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[#111827] text-[31px] tracking-[-0.5px] whitespace-nowrap transition-opacity duration-200">
            {value}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1e293b] text-[15px] whitespace-nowrap">
            {caption}
          </p>
        </div>

        <div className="relative w-full h-[54px] overflow-hidden rounded-md shrink-0" data-name="Group">
          <AreaSparkline data={sparklineData} className="h-full" />
        </div>
      </div>
    </div>
  );
}
