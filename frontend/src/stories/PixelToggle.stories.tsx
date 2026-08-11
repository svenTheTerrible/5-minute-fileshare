import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelToggle } from './PixelToggle';

const meta = {
  title: 'Example/PixelToggle',
  component: PixelToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {
  args: { checked: false, label: 'Dark mode', onChange: fn() },
};

export const On: Story = {
  args: { checked: true, label: 'Notifications', onChange: fn() },
};

export const DisabledOff: Story = {
  args: { checked: false, label: 'Locked option', disabled: true },
};
