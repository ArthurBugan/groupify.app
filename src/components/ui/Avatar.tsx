import { Image, View, Text } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ uri, name, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };

  const getInitials = (n: string = '') => 
    n.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${sizes[size]} rounded-full`}
      />
    );
  }

  return (
    <View className={`${sizes[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}>
      <Text className={`${textSizes[size]} text-gray-600 dark:text-gray-300 font-medium`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

export default Avatar;