import { View, ViewProps } from 'react-native';
import { ReactNode } from 'react';

interface CardProps extends ViewProps {
  children: ReactNode;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <View className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, className = '', ...props }: CardProps) {
  return (
    <View className={`p-4 ${className}`} {...props}>
      {children}
    </View>
  );
}

export default Card;