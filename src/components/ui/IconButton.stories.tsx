import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Search } from 'lucide-react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive'],
    },
    disabled: { control: 'boolean' },
    icon: { table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Settings className="size-4" />,
    'aria-label': 'Settings',
  },
};

/**
 * True CSS `:hover` can't be triggered programmatically from a story (no
 * pseudo-state addon is installed), so this pins the button's own hover
 * background class to show the resting hover appearance directly.
 */
export const Hover: Story = {
  args: {
    icon: <Settings className="size-4" />,
    'aria-label': 'Settings',
    className: 'bg-surface-muted',
  },
};

/** Uses a play function to genuinely focus the button, showing the real focus-visible ring. */
export const Focus: Story = {
  args: {
    icon: <Settings className="size-4" />,
    'aria-label': 'Settings',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button');
    button?.focus();
  },
};

export const Disabled: Story = {
  args: {
    icon: <Settings className="size-4" />,
    'aria-label': 'Settings',
    disabled: true,
  },
};

export const SettingsIcon: Story = {
  name: 'Settings',
  args: {
    icon: <Settings className="size-4" />,
    'aria-label': 'Settings',
  },
};

export const SearchIcon: Story = {
  name: 'Search',
  args: {
    icon: <Search className="size-4" />,
    'aria-label': 'Search',
  },
};
