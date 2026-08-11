"use client";

import { useId } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "./chart";

/**
 * A single standing bar, built on the official shadcn/ui Bar Chart
 * pattern (https://ui.shadcn.com/charts/bar) — the standard vertical
 * orientation, matching this card's existing "standing bars" style.
 * Same architecture as FunnelBar (one independent single-bar chart per
 * instance, in the same "language" as Player Funnel Performance): a
 * real Recharts scale drives the bar's height instead of a hand-drawn
 * SVG path, and each instance gets its own uniquely-id'd gradient.
 */

export interface RevenueBarChartProps {
  /** Raw value driving this bar's height, e.g. 24.6. */
  value: number;
  /** The largest value among sibling bars, so height is proportionally accurate across the set. */
  maxValue: number;
  gradientFrom: string;
  gradientTo: string;
  className?: string;
}

const revenueBarConfig = {
  value: { label: "Value" },
} satisfies ChartConfig;

export function RevenueBarChart({ value, maxValue, gradientFrom, gradientTo, className = "" }: RevenueBarChartProps) {
  const gradientId = `revenue-bar-gradient-${useId().replace(/:/g, "")}`;
  const chartData = [{ name: "value", value }];

  return (
    <ChartContainer config={revenueBarConfig} className={`h-full w-full ${className}`}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
        <XAxis type="category" dataKey="name" hide />
        <YAxis type="number" domain={[0, maxValue]} hide />
        <Bar dataKey="value" fill={`url(#${gradientId})`} radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  );
}
