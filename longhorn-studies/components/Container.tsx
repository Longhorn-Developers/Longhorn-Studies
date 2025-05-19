import { SafeAreaView, View } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className={styles.container}>{children}</SafeAreaView>
    </View>
  );
};

const styles = {
  container: 'flex flex-1 m-6',
};
