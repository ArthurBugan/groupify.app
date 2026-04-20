import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useChannels } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Channel } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChannelsListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { data, isLoading } = useChannels();
  const channels = data || [];

  const renderItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 mb-3"
      onPress={() => router.push(`/channels/edit/${item.id}`)}
    >
      <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
      {item.description && (
        <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-background p-4"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-3xl font-bold text-foreground">Channels</Text>
      </View>

      <FlatList
        data={channels}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">No channels yet.</Text>
        }
      />
    </View>
  );
}