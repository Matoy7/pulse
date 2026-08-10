import type { Meta, StoryObj } from '@storybook/react-vite';
import { PopularScreensTable } from './PopularScreensTable';

const meta = {
  title: 'Components/PopularScreensTable',
  component: PopularScreensTable,
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
} satisfies Meta<typeof PopularScreensTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Same representative data currently shown on the dashboard. */
export const Default: Story = {
  args: {
    rows: [
      { screen: 'Battle Pass', views: '45.2K', avgTime: '2m 01s', exitRate: '45.2%', indicatorColor: 'purple' },
      { screen: 'Store', views: '38.1K', avgTime: '2m 01s', exitRate: '38.1%', indicatorColor: 'purple' },
      { screen: 'Profile', views: '22.4K', avgTime: '2m 01s', exitRate: '22.4%', indicatorColor: 'purple' },
      { screen: 'Lobby', views: '18.3K', avgTime: '2m 01s', exitRate: '18.3%', indicatorColor: 'yellow' },
      { screen: 'Home', views: '18.3K', avgTime: '2m 01s', exitRate: '18.3%', indicatorColor: 'yellow' },
    ],
  },
};
