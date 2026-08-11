import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelNav, PixelAvatar } from './PixelNav';

const meta = {
  title: 'Example/PixelNav',
  component: PixelNav,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelNav>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = ['Home', 'Dashboard', 'Settings'];

export const Default: Story = {
  args: {
    brand: 'PixelApp',
    items: navItems,
    active: 'Home',
    onSelect: fn(),
  },
};

export const NoActive: Story = {
  args: {
    brand: 'PixelApp',
    items: navItems,
    onSelect: fn(),
  },
};

const avatarMeta = {
  title: 'Example/PixelAvatar',
  component: PixelAvatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelAvatar>;

export const AvatarDefault: StoryObj<typeof avatarMeta> = {
  args: { size: 40, children: 'AB' },
};
