import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
}

interface TabsListProps {
  children: ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export function Tabs({ children }: TabsProps) {
  return <View>{children}</View>;
}

export function TabsList({ children }: TabsListProps) {
  return (
    <View className="flex-row border-b border-gray-200 dark:border-gray-700">{children}</View>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  return <Text className="px-4 py-2">{children}</Text>;
}

export function TabsContent({ value, children }: TabsContentProps) {
  return <View className="p-4">{children}</View>;
}

export default Tabs;