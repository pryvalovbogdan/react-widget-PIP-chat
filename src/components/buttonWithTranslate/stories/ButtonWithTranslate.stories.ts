import type { Meta, StoryObj } from '@storybook/react';

import { ButtonWithTranslate } from '../index.tsx';

const meta = {
  title: 'Example/ButtonWithTranslate',
  component: ButtonWithTranslate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof ButtonWithTranslate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BaseCase: Story = {
  args: {
    backgroundColor: 'cyan',
    i18Key: 'count',
    handle: () => {},
    i18Value: 2,
  },
};

export const WithoutNumber: Story = {
  args: {
    backgroundColor: 'orange',
    i18Key: 'count',
    handle: () => {},
  },
};

export const WithoutBg: Story = {
  args: {
    i18Key: 'count',
    handle: () => {},
  },
};
