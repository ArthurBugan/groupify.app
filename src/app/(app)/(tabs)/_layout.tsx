import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColor = isDark ? '#fb7185' : '#f43f5e';
  const inactiveColor = isDark ? '#94a3b8' : '#9CA3AF';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#334155' : '#E5E7EB',
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
              size={22} 
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
              size={22} 
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
              size={22} 
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
              size={22} 
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
              size={22} 
              color={focused ? activeColor : inactiveColor} 
            />
          ),
        }}
      />
    </Tabs>
  );
}