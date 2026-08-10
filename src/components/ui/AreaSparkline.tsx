"use client";

import { useId } from "react";
import { Area, AreaChart, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "./chart";

/**
 * A compact area-chart sparkline, adapted from the official shadcn/ui
 * Area Chart (https://ui.shadcn.com/charts/area) — same underlying
 * Recharts primitives and the same ChartContainer/ChartConfig theming
 * approach, with everything not needed for a compact KPI visualization
 * stripped out: no axes, no grid, no legend, no tooltip, no visible
 * data points, no card chrome. What's kept from the reference is the
 * visual language: a smooth curved area, a thin primary-colored line,
 * and a clearly visible gradient fill beneath it.
 */

export interface AreaSparklineProps {
  /** Ordered numeric series to plot, e.g. [12, 18, 15, 24, 20, 29]. */
  data: number[];
  /** Rendered height in pixels. Width always fills the parent container. */
  height?: number;
  /** Optional className passthrough (e.g. to let a parent's height win instead). */
  className?: string;
}

// Reuses this project's own `primary` design token rather than shadcn's
// default --chart-1..--chart-5 palette, per the existing token system.
const areaSparklineConfig = {
  value: {
    label: "Trend",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function AreaSparkline({ data, height = 46, className = "" }: AreaSparklineProps) {
  const gradientId = `area-sparkline-fill-${useId().replace(/:/g, "")}`;
  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <ChartContainer
      config={areaSparklineConfig}
      className={`w-full ${className}`}
      style={{ height }}
    >
      <AreaChart data={chartData} margin={{ top: 3, right: 0, bottom: 0, left: 0 }}>
        {/* Hidden but not omitted: an explicit tight domain (no padding)
            makes the curve's own peak and trough touch the top/bottom of
            the plot area, so the line and its fill use the full compact
            height available rather than floating in a padded middle band. */}
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
            <stop offset="60%" stopColor="var(--color-value)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <Area
          type="natural"
          dataKey="value"
          stroke="var(--color-value)"
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
