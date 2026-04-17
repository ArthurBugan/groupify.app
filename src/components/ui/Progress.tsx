import { View, Text } from 'react-native';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className = '' }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <View className={`h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <View
        className="h-full bg-blue-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}

export default Progress;