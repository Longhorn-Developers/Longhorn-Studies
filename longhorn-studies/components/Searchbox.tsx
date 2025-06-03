import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TextInput, View } from 'react-native';

const Searchbox = ({ sharedTag }: { sharedTag?: string }) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center rounded-xl border border-gray-300 px-3 ">
      <Ionicons name="arrow-back" size={20} color="gray" onPress={router.back} />
      <TextInput
        placeholder="Explore study spots"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={(event) => {
          const query = event.nativeEvent.text;
          // Handle search logic here, e.g., navigate to search results
          console.log('Search query:', query);
        }}
        clearButtonMode="while-editing"
        className="flex-1 p-4"
        autoFocus
      />
    </View>
  );
};

export default Searchbox;
