import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Collapsible } from '../components/ui/collapsible';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  /*decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],*/
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "hi"
  },
};