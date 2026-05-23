import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { useDeleteGroup, useGroup, useBatchUpdateChannels } from '@/hooks';
import { useChannelsInfinite } from '@/hooks/useChannelsInfinite';
import { useAnimesInfinite } from '@/hooks/useAnimesInfinite';
import { useWebsitesInfinite } from '@/hooks/useWebsitesInfinite';
import { Card, CardContent, Checkbox, Button } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Channel, Anime, Website } from '@/types';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { FlashList } from '@shopify/flash-list';

const TABS = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'anime', label: 'Animes' },
  { key: 'website', label: 'Websites' },
];

export default function AddChannelToGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { data: groupItems } = useGroup(id);
  const deleteGroup = useDeleteGroup();

  const [activeTab, setActiveTab] = useState('youtube');
  const [search, setSearch] = useState('');
  const [selectedYoutube, setSelectedYoutube] = useState<Channel[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Channel[]>([]);
  const [selectedWebsites, setSelectedWebsites] = useState<Channel[]>([]);
  const { isDark } = useTheme();

  useEffect(() => {
    if (groupItems) {
      setSelectedYoutube(groupItems.channels?.filter(c => !c.contentType || c.contentType === 'youtube') || []);
      setSelectedAnime(groupItems.channels?.filter(c => c.contentType === 'anime') || []);
      setSelectedWebsites(groupItems.channels?.filter(c => c.contentType === 'website') || []);
    }
  }, [groupItems]);

  const {
    channels,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useChannelsInfinite({ limit: 20, page: 1, search });

  const {
    animes,
    loadMore: loadMoreAnimes,
    hasNextPage: hasNextPageAnimes,
    isFetchingNextPage: isFetchingNextPageAnimes,
    isLoading: isLoadingAnimes
  } = useAnimesInfinite();

  const {
    websites,
    loadMore: loadMoreWebsites,
    hasNextPage: hasNextPageWebsites,
    isFetchingNextPage: isFetchingNextPageWebsites,
    isLoading: isLoadingWebsites
  } = useWebsitesInfinite({ limit: 20, page: 1, search });

  const filteredChannels = channels || [];

  const toggleYoutube = useCallback((channel: Channel) => {
    setSelectedYoutube((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'youtube', groupId: id }]
    );
  }, [id]);

  const toggleAnime = useCallback((channel: Channel) => {
    setSelectedAnime((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'anime', groupId: id }]
    );
  }, [id]);

  const toggleWebsite = useCallback((channel: Channel) => {
    setSelectedWebsites((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'website', groupId: id }]
    );
  }, []);

const batchUpdateChannels = useBatchUpdateChannels();

  const handleSave = async () => {
    try {
      const allChannels = [
        ...selectedYoutube.map(ch => ({ ...ch, contentType: ch.contentType || 'youtube' })),
        ...selectedAnime.map(ch => ({ ...ch, contentType: 'anime' })),
        ...selectedWebsites.map(ch => ({ ...ch, contentType: 'website' }))
      ];

      const channels = allChannels
        .map(ch => ({
          id: ch.id,
          name: ch.name,
          thumbnail: ch.thumbnail,
          url: ch.url,
          groupId: id,
          contentType: ch.contentType,
          newContent: false
        }));

      await batchUpdateChannels.mutateAsync({
        groupId: id,
        data: { channels }
      });
      router.back();
    } catch (error) {
    }
  };

  const renderChannelItem = ({ item }: { item: Channel }) => {
    const isSelected = selectedYoutube.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleYoutube(item)}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox
              checked={isSelected}
              onChange={() => toggleYoutube(item)}
            />
            {item.thumbnail || item.imageUrl ? (
              <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-10 h-10 rounded-lg ml-3" />
            ) : (
              <View className="w-10 h-10 rounded-lg bg-default items-center justify-center ml-3">
                <IconifyIcon name="mdi:television-play" size={20} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text className="font-medium text-foreground">{item.name}</Text>
              <Text className="text-muted text-sm" numberOfLines={1}>{item.url}</Text>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderAnimeItem = ({ item }: { item: Anime }) => {
    const isSelected = selectedAnime.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleAnime(item)}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox
              checked={isSelected}
              onChange={() => toggleAnime(item)}
            />
            {item.thumbnail || item.imageUrl ? (
              <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-10 h-10 rounded-lg ml-3" />
            ) : (
              <View className="w-10 h-10 rounded-lg bg-default items-center justify-center ml-3">
                <IconifyIcon name="mdi:television-play" size={20} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text className="font-medium text-foreground">{item.name}</Text>
              {item.groupName && (
                <Text className="text-muted text-sm">{item.groupName}</Text>
              )}
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderAnimesFooter = () => {
    if (!isFetchingNextPageAnimes) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderWebsitesFooter = () => {
    if (!isFetchingNextPageWebsites) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderWebsiteItem = ({ item }: { item: Website }) => {
    const isSelected = selectedWebsites.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleWebsite(item)}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox checked={isSelected} onChange={() => toggleWebsite(item)} />
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} className="w-10 h-10 rounded-lg ml-3" />
            ) : (
              <View className="w-10 h-10 rounded-lg bg-default items-center justify-center ml-3">
                <IconifyIcon name="lucide:globe" size={20} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text className="font-medium text-foreground">{item.name}</Text>
              <Text className="text-muted text-sm" numberOfLines={1}>{item.url}</Text>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <DashboardHeader
          title="Add Channels"
          description={`Add channels to ${group?.name}`}
        />

        <View className="flex-row border-b border-border mb-4">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 items-center relative ${activeTab === tab.key ? 'border-b-2 border-primary' : ''
                }`}
            >
              <Text
                className={`font-medium ${activeTab === tab.key ? 'text-accent' : 'text-muted'
                  }`}
              >
                {tab.label}
                {tab.key === 'youtube' && selectedYoutube.length > 0 && ` (${selectedYoutube.length})`}
                {tab.key === 'anime' && selectedAnime.length > 0 && ` (${selectedAnime.length})`}
                {tab.key === 'website' && selectedWebsites.length > 0 && ` (${selectedWebsites.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab !== 'website' && (
          <TextInput
            placeholder="Search channels..."
            placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
            value={search}
            onChangeText={setSearch}
          />
        )}

        {activeTab === 'youtube' && (
          <FlashList
            data={filteredChannels || []}
            onEndReached={loadMore}
            renderItem={renderChannelItem}
            keyExtractor={(item, index) => `${item.id}-${selectedYoutube.length}`}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Text className="text-center text-muted mt-10">
                {isLoading ? 'Loading...' : 'No channels found.'}
              </Text>
            }
          />
        )}

        {activeTab === 'anime' && (
          <FlashList
            data={animes || []}
            onEndReached={loadMoreAnimes}
            renderItem={renderAnimeItem}
            keyExtractor={(item, index) => `${item.id}-${selectedAnime.length}`}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderAnimesFooter}
            ListEmptyComponent={
              <Text className="text-center text-muted mt-10">
                {isLoadingAnimes ? 'Loading...' : 'No animes found.'}
              </Text>
            }
          />
        )}

        {activeTab === 'website' && (
          <FlashList
            data={websites || []}
            onEndReached={loadMoreWebsites}
            renderItem={renderWebsiteItem}
            keyExtractor={(item, index) => `${item.id}-${selectedWebsites.length}`}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderWebsitesFooter}
            ListEmptyComponent={
              <Text className="text-center text-muted mt-10">
                {isLoadingWebsites ? 'Loading...' : 'No websites found.'}
              </Text>
            }
          />
        )}
      </SafeAreaView>

      <View className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button onPress={handleSave} fullWidth>
          Add Selected ({selectedYoutube.length + selectedAnime.length + selectedWebsites.length})
        </Button>
      </View>
    </View>
  );
}
