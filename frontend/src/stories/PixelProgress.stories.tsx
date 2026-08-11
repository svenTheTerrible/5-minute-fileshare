import type { Meta, StoryObj } from '@storybook/react-vite';

import { PixelProgress } from './PixelProgress';

const meta = {
  title: 'Example/PixelProgress',
  component: PixelProgress,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number', min: 0, max: 100 },
    blocks: { control: 'number', min: 5, max: 40 },
    indeterminate: { control: 'boolean' },
  },
} satisfies Meta<typeof PixelProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0, label: 'Upload', right: '0%' },
};

export const Half: Story = {
  args: { value: 50, blocks: 16, label: 'Progress', right: '50%' },
};

export const Complete: Story = {
  args: { value: 100, blocks: 24, label: 'Download', right: 'Done' },
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Loading…', right: '' },
};
