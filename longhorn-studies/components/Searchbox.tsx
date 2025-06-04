import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TextInput, View, TextInputProps } from 'react-native';

export interface SearchboxProps extends TextInputProps {
  sharedTag?: string;
}

const Searchbox = ({ sharedTag, ...props }: SearchboxProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center rounded-xl border border-gray-300 px-3 ">
      <Ionicons name="arrow-back" size={20} color="gray" onPress={router.back} />
      <TextInput
        placeholder="Explore study spots"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
        className="flex-1 p-4"
        autoFocus
        {...props}
      />
    </View>
  );
};

export default Searchbox;
