import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Group } from '@/types';

export default function GroupsListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { data, isLoading } = useGroups();
  const groups = data?.data || [];

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
      className="bg-card rounded-xl p-4 mb-3"
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
      {item.description && (
        <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold text-foreground">Groups</Text>
        <TouchableOpacity 
          className="bg-primary px-4 py-2 rounded-lg"
          onPress={() => router.push('/groups/new')}
        >
          <Text className="text-primary-foreground font-semibold">+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">No groups yet. Create one to get started!</Text>
        }
      />
    </View>
  );
}