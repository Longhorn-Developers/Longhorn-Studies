import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ThemedText } from '../components/themed-text';

const meta = {
  title: 'Components/ThemedText',
  component: ThemedText,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story>lorem ipsum</Story>
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ThemedText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'default',
    themeColor: 'background'
  },
};