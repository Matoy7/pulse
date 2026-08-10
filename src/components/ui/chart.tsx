"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";

/**
 * Minimal shadcn/ui chart infrastructure, adapted from the official
 * implementation (https://ui.shadcn.com/docs/components/chart).
 *
 * This is intentionally a trimmed-down version of shadcn's chart.tsx:
 * only `ChartContainer` and the `ChartConfig` type are included, since
 * they're the only pieces any current chart in this project (the
 * Sparkline) actually needs. shadcn's ChartTooltip/ChartTooltipContent
 * and ChartLegend/ChartLegendContent are deliberately omitted — nothing
 * uses them yet, and per the design-system rule for this phase, we only
 * introduce chart infrastructure that's actually required. They can be
 * added later, following the same official reference, if a future chart
 * needs a tooltip or legend.
 *
 * Colors are resolved via CSS custom properties (`var(--color-KEY)`),
 * matching Recharts v3 theming conventions. `ChartConfig` entries can
 * reference this project's own semantic design tokens directly (e.g.
 * `color: "var(--color-primary)"`) rather than shadcn's own
 * `--chart-1`..`--chart-5` palette, since this project already has its
 * own token system (src/styles/tokens.css).
 */

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

export function ChartContainer({
  id,
  className = "",
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-slot="chart" data-chart={chartId} className={`relative ${className}`} {...props}>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
}
