import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { PixelCard, PixelCardMedia, PixelCardTitle, PixelCardText, PixelCardFooter } from './PixelCard';

const meta = {
  title: 'Example/PixelCard',
  component: PixelCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PixelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <>
        <PixelCardTitle>Interactive Card</PixelCardTitle>
        <PixelCardText>This card responds to hover with a pixel shift effect.</PixelCardText>
      </>
    ),
  },
};

export const Static: Story = {
  args: {
    interactive: false,
    children: (
      <>
        <PixelCardTitle>Static Card</PixelCardTitle>
        <PixelCardText>This card is not interactive and has no hover effect.</PixelCardText>
      </>
    ),
  },
};

export const WithMedia: Story = {
  args: {
    media: <PixelCardMedia caption="Screenshot preview" />,
    children: (
      <>
        <PixelCardTitle>Screenshot Card</PixelCardTitle>
        <PixelCardText>A card with a placeholder screenshot slot above the content.</PixelCardText>
        <PixelCardFooter>
          <span>V1.0</span>
          <span>2024-01-01</span>
        </PixelCardFooter>
      </>
    ),
  },
};

export const Full: Story = {
  args: {
    interactive: true,
    media: <PixelCardMedia caption="Full example" />,
    children: (
      <>
        <PixelCardTitle>Full Card</PixelCardTitle>
        <PixelCardText>A complete card with media, title, description text, and a dashed footer row.</PixelCardText>
        <PixelCardFooter>
          <span>v2.3.1</span>
          <button type="button" onClick={fn()}>View Details</button>
        </PixelCardFooter>
      </>
    ),
  },
};
