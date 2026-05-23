import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { IconifyIcon } from '@/components/ui/IconifyIcon';

export default function GroupDetailTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#39d08a' : '#39d08a';
  const inactiveColor = isDark ? '#94a3b8' : '#9CA3AF';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
          borderTopColor: isDark ? '#1e1e1e' : '#e5e7eb',
          paddingTop: Platform.OS === 'ios' ? 8 : 4,
          height: Platform.OS === 'ios' ? 88 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon
              name="lucide:info"
              size={24}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="subgroups"
        options={{
          title: 'Subgroups',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon
              name="lucide:folder-open"
              size={24}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon
              name="lucide:settings"
              size={24}
              color={focused ? activeColor : inactiveColor}
            />
          ),
        }}
      />
    </Tabs>
  );
}