import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';

function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    home: '🏠',
    users: '👥',
    tv: '📺',
    film: '🎬',
    'more-horizontal': '•••',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name] || '•'}</Text>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#fb7185' : '#f43f5e',
        tabBarInactiveTintColor: isDark ? '#94a3b8' : '#9CA3AF',
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
          tabBarIcon: () => <TabIcon name="home" />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: () => <TabIcon name="users" />,
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: 'Channels',
          tabBarIcon: () => <TabIcon name="tv" />,
        }}
      />
      <Tabs.Screen
        name="animes"
        options={{
          title: 'Animes',
          tabBarIcon: () => <TabIcon name="film" />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: () => <TabIcon name="more-horizontal" />,
        }}
      />
    </Tabs>
  );
}