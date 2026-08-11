import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';
import { fn } from 'storybook/test';

import { PixelToastProvider, useToast } from './PixelToast';

const Trigger = () => {
  const push = useToast();
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <button type="button" onClick={() => push('Action completed!', 'accent')}>Show accent toast</button>
      <button type="button" onClick={() => push('Warning issued', 'warn')}>Show warn toast</button>
      <button type="button" onClick={() => push('Something broke', 'danger')}>Show danger toast</button>
    </div>
  );
};

const meta = {
  title: 'Example/PixelToastProvider',
  component: PixelToastProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Wrapped = (args: any) => (
  <PixelToastProvider {...args}>
    <Trigger />
  </PixelToastProvider>
);

export const Default: StoryObj<typeof meta & { render: typeof Wrapped }> = {
  render: Wrapped,
  args: { duration: 3000 },
};
