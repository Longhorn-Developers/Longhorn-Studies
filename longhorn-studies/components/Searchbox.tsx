import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

const Searchbox = () => {
  return (
    <View className="flex-row items-center rounded-xl border border-gray-300 px-3">
      <Ionicons name="search" size={20} color="gray" />
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
      />
    </View>
  );
};

export default Searchbox;
