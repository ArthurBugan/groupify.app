import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '@/hooks';
import type { Group } from '@/types';

export default function GroupsListScreen() {
  const router = useRouter();
  const { data, isLoading } = useGroups();

  const renderItem = ({ item }: { item: Group }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4"
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <View className="gap-1">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-gray-500" numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold text-gray-900">Groups</Text>
        <TouchableOpacity 
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.push('/groups/new')}
        >
          <Text className="text-white font-semibold">+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No groups yet. Create one to get started!</Text>
        }
      />
    </View>
  );
}