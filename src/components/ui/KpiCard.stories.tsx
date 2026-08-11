import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './KpiCard';

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
    sparklineData: { control: 'object' },
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
    sparklineData: [12, 18, 15, 24, 20, 29, 26, 33],
  },
};

export const Revenue: Story = {
  args: {
    title: 'Revenue',
    value: '$84,200',
    caption: 'Total revenue',
    sparklineData: [38, 42, 40, 47, 51, 49, 58, 62],
  },
};

export const DAU: Story = {
  args: {
    title: 'DAU',
    value: '430',
    caption: 'Daily active users',
    sparklineData: [180, 205, 195, 220, 210, 240, 235, 260],
  },
};

export const AverageSession: Story = {
  args: {
    title: 'Average Session',
    value: '13m 42s',
    caption: 'Average session duration',
    sparklineData: [9, 10, 9.5, 11, 12, 11.5, 13, 13.5],
  },
};

export const DropOffRate: Story = {
  args: {
    title: 'Drop Off Rate',
    value: '14.6%',
    caption: 'Players who leave',
    sparklineData: [18, 17, 16.5, 15, 15.5, 14, 14.6, 13.8],
  },
};
