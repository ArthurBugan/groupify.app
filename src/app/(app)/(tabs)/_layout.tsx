import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabIcon({ color, name }: { color: string; name: string }) {
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
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="home" />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="users" />,
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: 'Channels',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="tv" />,
        }}
      />
      <Tabs.Screen
        name="animes"
        options={{
          title: 'Animes',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="film" />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <TabIcon color={color} name="more-horizontal" />,
        }}
      />
    </Tabs>
  );
}