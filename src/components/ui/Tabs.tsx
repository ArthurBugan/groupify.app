import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ children, defaultValue, value: controlledValue, onValueChange }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isActive = (val: string) => controlledValue !== undefined ? controlledValue === val : internalValue === val;
  const setValue = (val: string) => {
    if (controlledValue !== undefined) {
      onValueChange?.(val);
    } else {
      setInternalValue(val);
    }
  };
  return <View>{children}</View>;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  const { isDark } = useTheme();
  return (
    <View className={`flex-row rounded-xl p-1 ${className}`} style={{ backgroundColor: getThemeColor('segment', isDark) }}>
      {children}
    </View>
  );
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { isDark } = useTheme();
  const [active, setActive] = useState(false);
  
  return (
    <TouchableOpacity
      className={`flex-1 py-2 px-4 rounded-lg items-center ${className}`}
      onPress={() => setActive(!active)}
      activeOpacity={0.7}
    >
      <Text className={`text-sm font-medium ${active ? 'text-accent' : 'text-muted'}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  return <View className={className}>{children}</View>;
}

export default Tabs;
