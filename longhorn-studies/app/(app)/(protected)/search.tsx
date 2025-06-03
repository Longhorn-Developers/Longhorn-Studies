import { View } from 'react-native';

import { Container } from '~/components/Container';
import Searchbox from '~/components/Searchbox';
import TagSelector from '~/components/TagSelector';

const Search = () => {
  return (
    <Container>
      <View className="gap-2">
        <Searchbox sharedTag="explore-search" />
        <TagSelector />
      </View>
    </Container>
  );
};

export default Search;
