import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useChannels } from '@/hooks';
import type { Channel } from '@/types';

export default function ChannelsListScreen() {
  const router = useRouter();
  const { data, isLoading } = useChannels();

  const renderItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity 
      className="bg-white rounded-xl p-4"
      onPress={() => router.push(`/channels/edit/${item.id}`)}
    >
      <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
      {item.description && (
        <Text className="text-sm text-gray-500" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold text-gray-900">Channels</Text>
      </View>

      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">No channels yet.</Text>
        }
      />
    </View>
  );
}