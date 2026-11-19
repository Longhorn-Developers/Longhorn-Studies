import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import StudySpotCard from '../components/ui/study-spot-card';

const meta = {
  title: 'Components/StudySpotCard',
  component: StudySpotCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StudySpotCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    locationName: "3rd Floor",
    buildingName: "Texas Union",
    location: "3rd Floor",
    hours: ["8:00am", "5:00pm"],
    tags: ["Quiet"],
  },
};