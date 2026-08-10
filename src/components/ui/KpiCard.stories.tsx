import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './KpiCard';

/**
 * A small, reusable line-sparkline used for the `chart` prop below.
 *
 * KpiCard's real dashboard instances each render their own unique,
 * pre-baked squiggle (defined privately inside the dashboard file, with
 * their own gradient ids) — those aren't exported, and pulling the
 * Dashboard module into Storybook would violate KpiCard's independence
 * from the app. This story sparkline reuses the exact same *visual
 * treatment* as the real ones (a translucent gradient fill under a
 * solid line, same brand colors) with real, static SVG path data — not
 * a placeholder box and not simulated/fake chart behavior — so stories
 * render KpiCard exactly as it composes in practice, just with
 * story-local artwork instead of the app's private squiggles.
 *
 * `gradientId` is a required prop, not a control, so multiple instances
 * rendered on the same page (e.g. the Docs page, which mounts every
 * story at once) never collide on the SVG gradient's id.
 */
function Sparkline({ gradientId }: { gradientId: string }) {
  return (
    <div className="absolute inset-0">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 76">
        <g>
          <path
            d="M0 52L26.7 46L53.3 56L80 40L106.7 48L133.3 30L160 38L186.7 20L213.3 34L240 16L266.7 26L293.3 12L320 22V76H0V52Z"
            fill={`url(#${gradientId})`}
            fillOpacity="0.6"
          />
          <path
            d="M0 52L26.7 46L53.3 56L80 40L106.7 48L133.3 30L160 38L186.7 20L213.3 34L240 16L266.7 26L293.3 12L320 22"
            stroke="#6032DC"
            strokeWidth="1.5"
          />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="0" x2="6" y1="10" y2="76">
            <stop stopColor="#7B6CF5" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#9D8FF9" stopOpacity="0.22" />
            <stop offset="1" stopColor="#C4BCFC" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const meta = {
  title: 'Components/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    caption: { control: 'text' },
    className: { control: 'text' },
    // The chart is composed-in artwork, not a simple control-friendly
    // value — hide it from the controls table per the brief.
    chart: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof KpiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A generic, non-dashboard-specific example. KpiCard always needs
 * KPI-specific content to be meaningful, so this demonstrates the
 * component's shape rather than standing in for a real metric.
 */
export const Default: Story = {
  args: {
    title: 'Metric',
    value: '1,234',
    caption: 'Description',
    chart: <Sparkline gradientId="story-sparkline-default" />,
  },
};

export const Revenue: Story = {
  args: {
    title: 'Revenue',
    value: '$84,200',
    caption: 'Total evenue',
    chart: <Sparkline gradientId="story-sparkline-revenue" />,
  },
};

export const DAU: Story = {
  args: {
    title: 'DAU',
    value: '430',
    caption: 'Total evenue',
    chart: <Sparkline gradientId="story-sparkline-dau" />,
  },
};

export const AverageSession: Story = {
  args: {
    title: 'Average Session',
    value: '13m 42s',
    caption: 'Total evenue',
    chart: <Sparkline gradientId="story-sparkline-avg-session" />,
  },
};

export const DropOffRate: Story = {
  args: {
    title: 'Drop Off Rate',
    value: '14.6%',
    caption: 'Total evenue',
    chart: <Sparkline gradientId="story-sparkline-drop-off" />,
  },
};
