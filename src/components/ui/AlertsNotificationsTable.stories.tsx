import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertsNotificationsTable } from './AlertsNotificationsTable';

const meta = {
  title: 'Components/AlertsNotificationsTable',
  component: AlertsNotificationsTable,
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
} satisfies Meta<typeof AlertsNotificationsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Same representative data currently shown on the dashboard, including click-to-expand details. */
export const Default: Story = {
  args: {
    alerts: [
      {
        id: 'retention-improved',
        message: 'Retention improved',
        timestamp: '2h ago',
        type: 'positive',
        detail:
          'Day-7 retention rose to 45.2%, up from 41.8% last period. Biggest gains came from the Tutorial → First Match step.',
      },
      {
        id: 'drop-off-increased',
        message: 'Drop Off increased',
        timestamp: '4h ago',
        type: 'warning',
        detail:
          'Drop-off after First Match rose to 14.6%. Matchmaking wait times on Android look like the likely cause — worth a closer look.',
      },
      {
        id: 'voice-chat-decreased',
        message: 'Voice Chat usage decreased',
        timestamp: '6h ago',
        type: 'negative',
        detail: 'Voice Chat sessions fell 6% week-over-week, coinciding with the new mute-by-default setting shipped last release.',
      },
      {
        id: 'season-launched-1',
        message: 'New season launched',
        timestamp: '1d ago',
        type: 'positive',
        detail: 'Season 12 is now live for all players. Early engagement is up 18% versus Season 11’s launch day.',
      },
      {
        id: 'season-launched-2',
        message: 'New season launched',
        timestamp: '1d ago',
        type: 'positive',
        detail: 'Season 12 rollout completed across all regions. No incidents reported during launch.',
      },
    ],
  },
};

/** All three alert types shown together, for a focused visual review of each variant. */
export const MixedStatuses: Story = {
  name: 'Mixed statuses',
  args: {
    alerts: [
      {
        id: 'mixed-positive',
        message: 'Retention improved',
        timestamp: '2h ago',
        type: 'positive',
        detail: 'Day-7 retention rose to 45.2%, up from 41.8% last period.',
      },
      {
        id: 'mixed-warning',
        message: 'Drop Off increased',
        timestamp: '4h ago',
        type: 'warning',
        detail: 'Drop-off after First Match rose to 14.6%.',
      },
      {
        id: 'mixed-negative',
        message: 'Voice Chat usage decreased',
        timestamp: '6h ago',
        type: 'negative',
        detail: 'Voice Chat sessions fell 6% week-over-week.',
      },
    ],
  },
};
