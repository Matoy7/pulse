import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificationButton } from './NotificationButton';

const meta = {
  title: 'Components/NotificationButton',
  component: NotificationButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 200, step: 1 } },
  },
} satisfies Meta<typeof NotificationButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoNotifications: Story = {
  name: 'No notifications',
  args: {
    count: 0,
  },
};

export const OneNotification: Story = {
  name: '1 notification',
  args: {
    count: 1,
  },
};

export const ThreeNotifications: Story = {
  name: '3 notifications',
  args: {
    count: 3,
  },
};

export const NinetyNinePlusNotifications: Story = {
  name: '99+ notifications',
  args: {
    count: 150,
  },
};
