import type { Meta, StoryObj } from '@storybook/react';

import { Header } from '../index.tsx';

const meta = {
  title: 'Example/Header',
  component: Header,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Header',
  },
};
