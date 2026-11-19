import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import SunIcon from '../components/ui/icons/sun';

const meta = {
  title: 'Icons/Sun',
  component: SunIcon,
  /*decorators: [
    (Story) => (
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],*/
  tags: ['autodocs'],
  //argTypes: {
  //  color: { control: 'text' },
  //  size: { control: 'text' },
  //},
} satisfies Meta<typeof SunIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  
};