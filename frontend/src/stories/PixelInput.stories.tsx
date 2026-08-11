import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { PixelInput, PixelTextarea, PixelLabel } from "./PixelInput";

const meta = {
  title: "Example/PixelInput",
  component: PixelInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PixelInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
  },
};

export const WithHint: Story = {
  args: {
    label: "Email",
    hint: "We will never share your email with anyone.",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password must be at least 8 characters.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Read-only Field",
    value: "Cannot edit this",
    disabled: true,
  },
};

const textareaMeta = {
  title: "Example/PixelTextarea",
  component: PixelTextarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PixelTextarea>;

export const TextareaDefault: StoryObj<typeof textareaMeta> = {
  args: {
    label: "Description",
    rows: 4,
  },
};

const labelMeta = {
  title: "Example/PixelLabel",
  component: PixelLabel,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PixelLabel>;

export const LabelMuted: StoryObj<typeof labelMeta> = {
  args: { tone: "muted", children: "Muted label" },
};

export const LabelError: StoryObj<typeof labelMeta> = {
  args: { tone: "error", children: "Error state label" },
};
