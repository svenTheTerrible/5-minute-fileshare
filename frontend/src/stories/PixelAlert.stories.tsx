import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelAlert } from './PixelAlert';

const meta = {
  title: 'Example/PixelAlert',
  component: PixelAlert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['success', 'warn', 'error'],
    },
  },
} satisfies Meta<typeof PixelAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    tone: 'success',
    children: 'Operation completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warn',
    children: 'Please double-check your settings before continuing.',
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
    children: 'Something went wrong. Please try again later.',
  },
};

export const CustomTag: Story = {
  args: {
    tone: 'success',
    tag: 'INFO',
    children: 'A custom-tagged alert message.',
  },
};
