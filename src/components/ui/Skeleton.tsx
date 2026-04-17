import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, className = '' }: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? { width } : undefined;
  const heightStyle = typeof height === 'number' ? { height } : undefined;

  return (
    <View
      className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={[widthStyle, heightStyle]}
    />
  );
}

export default Skeleton;