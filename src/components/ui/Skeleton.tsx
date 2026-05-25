import { View, Animated } from 'react-native';
import { getThemeColor } from '@/theme/themeColors';
import { useTheme } from '@/theme/ThemeProvider';
import { useEffect, useRef } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, className = '' }: SkeletonProps) {
  const { isDark } = useTheme();
  const widthStyle = typeof width === 'number' ? { width } : undefined;
  const heightStyle = typeof height === 'number' ? { height } : undefined;
  const animValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return animation.stop.bind(animation);
  }, [animValue]);

  const opacity = animValue.interpolate({
    inputRange: [0.3, 0.6],
    outputRange: [0.4, 0.8],
    extrapolate: 'clamp',
  });

  const bgColor = isDark ? getThemeColor('surface-secondary', isDark) : getThemeColor('default', isDark);

  return (
    <Animated.View
      className={`rounded ${className}`}
      style={[
        widthStyle,
        heightStyle,
        { backgroundColor: bgColor, opacity },
      ]}
    />
  );
}

export default Skeleton;
