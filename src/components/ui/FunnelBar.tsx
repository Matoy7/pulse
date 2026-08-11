"use client";

import { useId } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, type ChartConfig } from "./chart";

/**
 * A single horizontal funnel-stage bar, built on the official shadcn/ui
 * horizontal Bar Chart pattern (https://ui.shadcn.com/charts/bar) —
 * Recharts' `layout="vertical"` orientation, which renders bars
 * horizontally. Each funnel row gets its own independent single-bar
 * chart rather than one combined multi-category chart, so the existing
 * per-row icon + label layout didn't need to change — only the bar
 * itself is now a real, data-driven Recharts bar instead of a
 * hand-positioned div.
 *
 * The percentage is rendered via Recharts' own `LabelList`, positioned
 * relative to the bar's actual rendered length — so the label can never
 * drift out of sync with the bar's size the way an independently
 * hand-placed label could.
 */

export interface FunnelBarProps {
  /** 0-100. Also drives the bar's rendered length directly (domain is fixed [0, 100]). */
  value: number;
  gradientFrom: string;
  gradientTo: string;
  /** Percentage label color — varies per row in the original design for contrast against lighter fills. */
  labelColor: string;
  /** Shown in the hover tooltip, e.g. "Tutorial Completed". */
  stageName: string;
  className?: string;
}

const funnelBarConfig = {
  value: { label: "Percent" },
} satisfies ChartConfig;

export function FunnelBar({ value, gradientFrom, gradientTo, labelColor, stageName, className = "" }: FunnelBarProps) {
  const gradientId = `funnel-bar-gradient-${useId().replace(/:/g, "")}`;
  const chartData = [{ name: stageName, value }];

  return (
    <div className={`group/bar relative h-full w-full cursor-default ${className}`} data-name="Container">
      <ChartContainer config={funnelBarConfig} className="h-full w-full">
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap={0}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar
            dataKey="value"
            fill={`url(#${gradientId})`}
            radius={8}
            background={{ fill: "#f3f4f6", radius: 8 }}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="insideRight"
              offset={10}
              formatter={(v) => `${v}%`}
              fill={labelColor}
              fontSize={13}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        {value}% • {stageName}
      </div>
    </div>
  );
}
