import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useChannelsInfinite } from '@/hooks/useChannelsInfinite';
import { useTheme } from '@/theme/ThemeProvider';
import type { Channel } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icons';
import { useState } from 'react';
import { LegendList } from '@legendapp/list';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function ChannelsListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const {
    channels,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useChannelsInfinite({ limit: 20, page: 1, search });

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  const renderItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      className="bg-card rounded-xl p-4 mb-3 flex-row items-center gap-3"
      onPress={() => router.push(`/channels/change-group/${item.id}`)}
    >
      {item.thumbnail || item.imageUrl ? (
        <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-12 h-12 rounded-xl" />
      ) : (
        <View className="w-12 h-12 rounded-xl bg-secondary items-center justify-center">
          <Icon name="tv" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.groupName && (
          <View className="flex-row items-center gap-1 mt-1">
            <IconifyIcon name={getGroupIcon(item.groupIcon)} size={12} />
            <Text className="text-xs text-muted-foreground">{item.groupName}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-background p-4"
    >
      <Text className="text-3xl font-bold text-foreground mb-4 pl-4">Channels</Text>

      <View className="mb-4 p-4">
        <TextInput
          className="bg-card rounded-xl p-3 text-foreground"
          placeholder="Search channels..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}

        />
      </View>

      <LegendList
        data={channels || []}
        onEndReached={loadMore}
        renderItem={renderItem}
        className="p-4 pt-0"
        keyExtractor={(item, index) => String(item.channelId ?? '' + item.createdAt + index)}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">
            {isLoading ? 'Loading...' : 'No channels found.'}
          </Text>
        }
      />
    </View>
  );
}
