import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelModal } from './PixelModal';

const meta = {
  title: 'Example/PixelModal',
  component: PixelModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    width: { control: 'number', min: 300, max: 900 },
  },
} satisfies Meta<typeof PixelModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const ModalDemo = (args: typeof PixelModal) => <PixelModal {...args}>
  <p>This is the modal body content. Press Escape or click outside to close.</p>
</PixelModal>;

export const Open: StoryObj<typeof meta & { render: typeof ModalDemo }> = {
  render: ModalDemo,
  args: {
    open: true,
    title: 'Confirm Action',
    width: 480,
    onClose: fn(),
    children: 'Are you sure you want to proceed?',
  },
};

export const WithFooter: StoryObj<typeof meta & { render: typeof ModalDemo }> = {
  render: ModalDemo,
  args: {
    open: true,
    title: 'Settings',
    width: 520,
    footer: (
      <>
        <button type="button" onClick={fn()}>Cancel</button>
        <button type="button" onClick={fn()}>Save</button>
      </>
    ),
    children: 'Modify your settings here.',
  },
};

export const Closed: StoryObj<typeof meta & { render: typeof ModalDemo }> = {
  render: ModalDemo,
  args: {
    open: false,
    title: 'Hidden',
    onClose: fn(),
    children: 'This modal is not visible.',
  },
};
