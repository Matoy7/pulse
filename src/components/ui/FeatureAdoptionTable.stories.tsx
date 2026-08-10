import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeatureAdoptionTable } from './FeatureAdoptionTable';

const meta = {
  title: 'Components/FeatureAdoptionTable',
  component: FeatureAdoptionTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FeatureAdoptionTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Same representative data currently shown on the dashboard. */
export const Default: Story = {
  args: {
    rows: [
      { feature: 'Daily Challenges', users: '45.2K', adoption: '85%', trend: 'up' },
      { feature: 'Battle Pass', users: '38.1K', adoption: '12%', trend: 'up' },
      { feature: 'Ranked Mode', users: '22.4K', adoption: '43%', trend: 'up' },
      { feature: 'Voice Chat', users: '18.3K', adoption: '88%', trend: 'flat' },
      { feature: 'Clan System', users: '18.3K', adoption: '44%', trend: 'down' },
    ],
  },
};
