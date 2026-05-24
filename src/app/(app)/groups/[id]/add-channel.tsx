import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Input as TextInput } from 'heroui-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useGroup, useBatchUpdateChannels } from '@/hooks';
import { useChannelsInfinite } from '@/hooks/useChannelsInfinite';
import { useAnimesInfinite } from '@/hooks/useAnimesInfinite';
import { useWebsitesInfinite } from '@/hooks/useWebsitesInfinite';
import { Card, CardContent, Checkbox, Button } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Channel, Anime, Website } from '@/types';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { channelsApi } from '@/api/endpoints/channels';
import { FlashList } from '@shopify/flash-list';

const TABS = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'anime', label: 'Animes' },
  { key: 'website', label: 'Websites' },
];

export default function AddChannelToGroupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { data: groupItems } = useGroup(id);
  const batchUpdateChannels = useBatchUpdateChannels();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState('youtube');
  const [search, setSearch] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [selectedYoutube, setSelectedYoutube] = useState<Channel[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Channel[]>([]);
  const [selectedWebsites, setSelectedWebsites] = useState<Channel[]>([]);
  const isFetchingMore = useRef(false);

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
    isFetchingNextPage,
    isLoading,
    setSearch: setChannelsSearch,
  } = useChannelsInfinite({ limit: 20 });

  const {
    animes,
    loadMore: loadMoreAnimes,
    isFetchingNextPage: isFetchingNextPageAnimes,
    isLoading: isLoadingAnimes,
    setSearch: setAnimesSearch,
  } = useAnimesInfinite();

  const {
    websites,
    loadMore: loadMoreWebsites,
    isFetchingNextPage: isFetchingNextPageWebsites,
    isLoading: isLoadingWebsites,
  } = useWebsitesInfinite({ limit: 20 });

  useEffect(() => {
    setChannelsSearch(search);
    setAnimesSearch(search);
  }, [search]);

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

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    try {
      const channel = await channelsApi.fetchUrl(urlInput.trim());
      const contentType = activeTab === 'youtube' ? 'youtube' : 'website';
      const setSelected = activeTab === 'youtube' ? setSelectedYoutube : setSelectedWebsites;
      setSelected((prev: Channel[]) =>
        prev.some(c => c.id === channel.id)
          ? prev
          : [...prev, { ...channel, contentType, groupId: id }]
      );
      setUrlInput('');
    } catch {
      Alert.alert('Error', 'Failed to fetch channel from URL.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleSave = async () => {
    try {
      const allChannels = [
        ...selectedYoutube.map(ch => ({ ...ch, contentType: ch.contentType || 'youtube' })),
        ...selectedAnime.map(ch => ({ ...ch, contentType: 'anime' })),
        ...selectedWebsites.map(ch => ({ ...ch, contentType: 'website' }))
      ];

      const channelsToSave = allChannels.map(ch => ({
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
        data: { channels: channelsToSave }
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
            <Checkbox checked={isSelected} onChange={() => toggleYoutube(item)} />
            {item.thumbnail || item.imageUrl ? (
              <Image
                key={item.id + (item.thumbnail || item.imageUrl)}
                source={{ uri: item.thumbnail || item.imageUrl }}
                style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }} className="bg-default items-center justify-center">
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
            <Checkbox checked={isSelected} onChange={() => toggleAnime(item)} />
            {item.thumbnail || item.imageUrl ? (
              <Image
                key={item.id + (item.thumbnail || item.imageUrl)}
                source={{ uri: item.thumbnail || item.imageUrl }}
                style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }} className="bg-default items-center justify-center">
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

  const renderWebsiteItem = ({ item }: { item: Website }) => {
    const isSelected = selectedWebsites.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleWebsite(item)}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox checked={isSelected} onChange={() => toggleWebsite(item)} />
            {(item.thumbnail || (item as any).imageUrl) ? (
              <Image
                key={item.id + (item.thumbnail || (item as any).imageUrl || '')}
                source={{ uri: item.thumbnail || (item as any).imageUrl }}
                style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 40, height: 40, borderRadius: 8, marginLeft: 12 }} className="bg-default items-center justify-center">
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

  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'youtube': return { data: filteredChannels, loading: isLoading, fetchNext: loadMore, fetchingNext: isFetchingNextPage, renderItem: renderChannelItem };
      case 'anime': return { data: animes || [], loading: isLoadingAnimes, fetchNext: loadMoreAnimes, fetchingNext: isFetchingNextPageAnimes, renderItem: renderAnimeItem };
      case 'website': {
        const merged = [
          ...selectedWebsites.filter(s => !(websites || []).some(w => w.id === s.id)),
          ...(websites || []),
        ];
        return { data: merged, loading: isLoadingWebsites, fetchNext: loadMoreWebsites, fetchingNext: isFetchingNextPageWebsites, renderItem: renderWebsiteItem };
      }
    }
  }, [activeTab, filteredChannels, isLoading, isFetchingNextPage, loadMore, animes, isLoadingAnimes, isFetchingNextPageAnimes, loadMoreAnimes, websites, isLoadingWebsites, isFetchingNextPageWebsites, loadMoreWebsites, selectedWebsites]);

  const totalSelected = selectedYoutube.length + selectedAnime.length + selectedWebsites.length;

  return (
    <View className="flex-1 bg-background">
      <View style={{ paddingTop: insets.top }} className="flex-1">
        <View className="px-4 pb-2">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Text className="text-accent">← Back</Text>
            </TouchableOpacity>
          </View>
          <DashboardHeader title="Add Channels" description={`Add channels to ${group?.name}`} />
        </View>

        <View className="flex-row border-b border-border mx-4">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 items-center relative ${activeTab === tab.key ? 'border-b-2 border-primary' : ''}`}
            >
              <Text className={`font-medium ${activeTab === tab.key ? 'text-accent' : 'text-muted'}`}>
                {tab.label}
                {tab.key === 'youtube' && selectedYoutube.length > 0 && ` (${selectedYoutube.length})`}
                {tab.key === 'anime' && selectedAnime.length > 0 && ` (${selectedAnime.length})`}
                {tab.key === 'website' && selectedWebsites.length > 0 && ` (${selectedWebsites.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-4 pt-3 pb-1">
          {activeTab !== 'website' && (
            <TextInput
              className='mb-2'
              placeholder="Search channels..."
              placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
              value={search}
              onChangeText={setSearch}
            />
          )}
        </View>

        <View className="flex-1 px-4">
          {activeTab === 'website' && (
            <View className="flex-row items-center gap-2 mb-3">
              <TextInput
                placeholder="Paste website URL..."
                className='mb-2 flex-1'
                placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
                value={urlInput}
                onChangeText={setUrlInput}
                onSubmitEditing={handleFetchUrl}
              />
              <TouchableOpacity
                onPress={handleFetchUrl}
                disabled={isFetchingUrl || !urlInput.trim()}
                className="bg-accent px-4 py-2.5 rounded-lg"
              >
                {isFetchingUrl ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-primary font-medium">Fetch</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          <FlashList
            key={activeTab}
            data={currentData?.data ?? []}
            keyExtractor={(item) => String(item.id)}
            renderItem={currentData?.renderItem as any}
            onEndReached={() => {
              if (isFetchingMore.current) return;
              if (!currentData?.fetchNext) return;
              isFetchingMore.current = true;
              Promise.resolve(currentData.fetchNext()).finally(() => {
                isFetchingMore.current = false;
              });
            }}
            onEndReachedThreshold={0.5}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 80 }}
            ListFooterComponent={
              currentData?.fetchingNext ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              currentData?.loading ? (
                <Text className="text-center text-muted mt-10">Loading...</Text>
              ) : (
                <Text className="text-center text-muted mt-10">
                  No {activeTab === 'youtube' ? 'channels' : activeTab === 'anime' ? 'animes' : 'websites'} found.
                </Text>
              )
            }
          />
        </View>
      </View>

      <View style={{ paddingBottom: insets.bottom }} className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-background border-t border-border">
        <Button onPress={handleSave} fullWidth loading={batchUpdateChannels.isPending}>
          {batchUpdateChannels.isPending ? 'Saving...' : `Add Selected (${totalSelected})`}
        </Button>
      </View>
    </View>
  );
}
