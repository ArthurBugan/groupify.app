import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { IconifyIcon } from '@/components/ui/IconifyIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#39d08a' : '#39d08a';
  const inactiveColor = isDark ? '#94a3b8' : '#9CA3AF';
  
  const isIOS = Platform.OS === 'ios';
  
  const tabBarBg = isDark ? '#0a0a0a' : '#fafafa';
  const borderColor = isDark ? '#1e1e1e' : '#e5e7eb';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopWidth: isIOS ? 0 : 1,
          borderTopColor: borderColor,
          paddingTop: isIOS ? 8 : 4,
          height: isIOS ? 88 : 60,
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
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon 
              name="lucide:layout" 
              size={24} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon 
              name="lucide:folder" 
              size={24} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: 'Channels',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon 
              name="lucide:tv" 
              size={24} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="animes"
        options={{
          title: 'Animes',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon 
              name="lucide:video" 
              size={24} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => (
            <IconifyIcon 
              name="tdesign:more" 
              size={24} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
    </Tabs>
  );
}