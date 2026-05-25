import { Image, View, Text } from 'react-native';
import { getThemeColor } from '@/theme/themeColors';
import { useTheme } from '@/theme/ThemeProvider';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ uri, name, size = 'md' }: AvatarProps) {
  const { isDark } = useTheme();
  
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-20 h-20' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-2xl', xl: 'text-3xl' };

  const getInitials = (n: string = '') => 
    n.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);

  // Generate a consistent color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'hsl(158 72% 38%)', // accent green
      'hsl(220 70% 50%)',  // blue
      'hsl(280 60% 50%)',  // purple
      'hsl(30 80% 50%)',   // orange
      'hsl(340 70% 50%)',  // pink
      'hsl(170 60% 40%)',  // teal
      'hsl(45 90% 50%)',   // yellow
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        className={`${sizes[size]} rounded-full`}
      />
    );
  }

  const displayName = name || '?';
  const initials = getInitials(displayName);
  const bgColor = getColorFromName(displayName);

  return (
    <View className={`${sizes[size]} rounded-full flex items-center justify-center`} style={{ backgroundColor: bgColor }}>
      <Text className={`${textSizes[size]} text-white font-bold`}>
        {initials}
      </Text>
    </View>
  );
}

export default Avatar;
