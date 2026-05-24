import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Input as TextInput } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useChannelsInfinite } from '@/hooks/useChannelsInfinite';
import { useTheme } from '@/theme/ThemeProvider';
import type { Channel } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icons';
import { useState, useMemo } from 'react';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { InlineAd } from '@/components/ui/Admob';
import { Skeleton } from '@/components/ui';
import { FlashList } from '@shopify/flash-list';

type ListItem = Channel | { isAd: true; id: string };

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

  const channelsWithAds = useMemo(() => {
    if (!channels) return [];
    const result: ListItem[] = [];
    channels.forEach((channel, index) => {
      result.push(channel);
      if ((index + 1) % 5 === 0) {
        result.push({ isAd: true, id: `ad-${index}` });
      }
    });
    return result;
  }, [channels]);

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  const renderChannel = ({ item }: { item: Channel }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-1.5 mb-2 flex-row items-center gap-3"
      onPress={() => router.push(`/channels/change-group/${item.id}`)}
    >
      {(item.thumbnail || (item as any).imageUrl) ? (
        <Image source={{ uri: item.thumbnail || (item as any).imageUrl }} style={{ width: 40, height: 40, borderRadius: 12 }} />
      ) : (
        <View className="w-10 h-10 rounded-xl bg-default items-center justify-center">
          <Icon name="tv" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-muted mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.groupName && (
          <View className="flex-row items-center gap-1 mt-1">
            <IconifyIcon name={getGroupIcon(item.groupIcon)} size={12} />
            <Text className="text-xs text-muted">{item.groupName}</Text>
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
          placeholder="Search channels..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}

        />
      </View>

      <FlashList
        data={channelsWithAds}
        onEndReached={loadMore}
        renderItem={({ item }) => {
          if ('isAd' in item) {
            return <InlineAd />;
          }
          return renderChannel({ item });
        }}
        className="p-4 pt-0"
        keyExtractor={(item, index) => item.id + index}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} className="bg-surface rounded-xl p-4 flex-row items-center gap-3">
                  <Skeleton width={40} height={40} className="rounded-lg" />
                  <View className="flex-1 gap-2">
                    <Skeleton height={16} className="w-3/4 rounded" />
                    <Skeleton height={12} className="w-1/2 rounded" />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="p-8 items-center">
              <IconifyIcon name="lucide:tv" size={48} className="text-muted mb-4" />
              <Text className="text-muted text-center">No channels found.</Text>
            </View>
          )
        }
      />
    </View>
  );
}
