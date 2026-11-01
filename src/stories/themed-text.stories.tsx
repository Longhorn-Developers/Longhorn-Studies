import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ThemedText } from '../components/themed-text';

const meta = {
  title: 'Components/ThemedText',
  component: ThemedText,
  tags: ['autodocs'],
} satisfies Meta<typeof ThemedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'default',
  },
};