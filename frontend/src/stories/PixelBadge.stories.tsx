import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelBadge } from './PixelBadge';

const meta = {
  title: 'Example/PixelBadge',
  component: PixelBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['accent', 'warn', 'danger', 'neutral', 'quiet'],
    },
  },
} satisfies Meta<typeof PixelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Accent: Story = {
  args: {
    tone: 'accent',
    children: 'Accent Badge',
  },
};

export const Warn: Story = {
  args: {
    tone: 'warn',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    children: 'Danger',
  },
};

export const Neutral: Story = {
  args: {
    tone: 'neutral',
    children: 'Neutral',
  },
};

export const Quiet: Story = {
  args: {
    tone: 'quiet',
    children: 'Quiet',
  },
};
