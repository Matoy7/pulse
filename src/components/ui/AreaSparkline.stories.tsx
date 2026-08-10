import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaSparkline } from './AreaSparkline';

const meta = {
  title: 'Components/AreaSparkline',
  component: AreaSparkline,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    data: { control: 'object' },
    height: { control: { type: 'number', min: 24, max: 200, step: 2 } },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AreaSparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: [12, 18, 15, 24, 20, 29, 26, 33],
    height: 64,
  },
};

export const Increasing: Story = {
  args: {
    data: [10, 14, 13, 19, 22, 26, 31, 38],
    height: 64,
  },
};

export const Decreasing: Story = {
  args: {
    data: [40, 36, 37, 30, 27, 24, 19, 15],
    height: 64,
  },
};

export const Volatile: Story = {
  args: {
    data: [22, 34, 14, 30, 12, 28, 16, 25],
    height: 64,
  },
};
