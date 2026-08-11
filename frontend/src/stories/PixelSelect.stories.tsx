import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelSelect } from './PixelSelect';

const meta = {
  title: 'Example/PixelSelect',
  component: PixelSelect,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const stringOptions = ['Red', 'Green', 'Blue'];
const objectOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

export const StringOptions: Story = {
  args: {
    label: 'Color',
    options: stringOptions,
    value: 'Green',
    onChange: fn(),
  },
};

export const ObjectOptions: Story = {
  args: {
    label: 'Fruit',
    options: objectOptions,
    value: undefined,
    onChange: fn(),
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Language',
    options: ['English', 'Spanish', 'French'],
    value: 'English',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked',
    options: objectOptions,
    value: 'apple',
    disabled: true,
  },
};
