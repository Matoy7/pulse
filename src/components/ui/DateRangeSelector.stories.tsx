import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangeSelector } from './DateRangeSelector';

const meta = {
  title: 'Components/DateRangeSelector',
  component: DateRangeSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: { control: 'text' },
    defaultOpen: { control: 'boolean' },
    className: { control: 'text' },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
} satisfies Meta<typeof DateRangeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Uncontrolled, defaults to the first option ("Last 24 Hours"). */
export const Default: Story = {
  args: {},
};

export const Last24Hours: Story = {
  name: 'Last 24 Hours',
  args: {
    defaultValue: '24h',
  },
};

export const Last7Days: Story = {
  name: 'Last 7 Days',
  args: {
    defaultValue: '7d',
  },
};

export const Last30Days: Story = {
  name: 'Last 30 Days',
  args: {
    defaultValue: '30d',
  },
};

export const Last90Days: Story = {
  name: 'Last 90 Days',
  args: {
    defaultValue: '90d',
  },
};

/** Rendered with the menu already open, to review the option list and selected-state indicator. */
export const Open: Story = {
  args: {
    defaultValue: '7d',
    defaultOpen: true,
  },
};
