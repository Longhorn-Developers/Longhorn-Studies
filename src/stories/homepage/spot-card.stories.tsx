import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import SpotCardSmall from '../../components/homepage/spot-card-small';

const meta = {
  title: 'HomePage/SpotCardSmall',
  component: SpotCardSmall,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SpotCardSmall>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imgSrc: "https://www.rambleratx.com/wp-content/uploads/2022/06/Texas-Union.jpeg",
    building: "Union",
    location: "Cactus Cafe",
    rating: "4.6",
  },
};