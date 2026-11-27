import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import FeaturedCard from '../../components/homepage/featured-card';

const meta = {
  title: 'HomePage/FeaturedCard',
  component: FeaturedCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FeaturedCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imgSrc: "https://www.rambleratx.com/wp-content/uploads/2022/06/Texas-Union.jpeg",
    header: "LHD Recommends",
    building: "Rowling Hall",
    location: "2nd Floor",
  },
};