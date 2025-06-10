import { SafeAreaView, View } from 'react-native';

export const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className={`m-6 flex flex-1 ${className}`}>{children}</SafeAreaView>
    </View>
  );
};
