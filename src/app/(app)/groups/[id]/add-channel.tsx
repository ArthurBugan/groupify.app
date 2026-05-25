import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Image } from 'react-native';
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
import { getThemeColor } from '@/theme/themeColors';
import * as Haptics from 'expo-haptics';

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
    setIsActive,
  } = useChannelsInfinite({ limit: 20 });

  const {
    animes,
    loadMore: loadMoreAnimes,
    isFetchingNextPage: isFetchingNextPageAnimes,
    isLoading: isLoadingAnimes,
    setSearch: setAnimesSearch,
    setIsActive: setAnimesIsActive,
  } = useAnimesInfinite();

  useEffect(() => {
    setIsActive(true);
    setAnimesIsActive(true);
  }, [setIsActive, setAnimesIsActive]);

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
    Haptics.selectionAsync();
    setSelectedYoutube((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'youtube', groupId: id }]
    );
  }, [id]);

  const toggleAnime = useCallback((channel: Channel) => {
    Haptics.selectionAsync();
    setSelectedAnime((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'anime', groupId: id }]
    );
  }, [id]);

  const toggleWebsite = useCallback((channel: Channel) => {
    Haptics.selectionAsync();
    setSelectedWebsites((prev) =>
      prev.some(c => c.id === channel.id)
        ? prev.filter((c) => c.id !== channel.id)
        : [...prev, { ...channel, contentType: 'website', groupId: id }]
    );
  }, []);

  const handleFetchUrl = async () => {
    Haptics.selectionAsync();
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
    Haptics.selectionAsync();
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
      Alert.alert('Error', 'Failed to save channels');
    }
  };

  const renderChannelItem = ({ item }: { item: Channel }) => {
    const isSelected = selectedYoutube.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleYoutube(item)} activeOpacity={0.7}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox checked={isSelected} onChange={() => toggleYoutube(item)} />
            {item.thumbnail || item.imageUrl ? (
              <Image
                key={item.id + (item.thumbnail || item.imageUrl)}
                source={{ uri: item.thumbnail || item.imageUrl }}
                style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }} className="bg-default items-center justify-center">
                <IconifyIcon name="lucide:tv" size={20} color={getThemeColor('foreground', isDark)} />
              </View>
            )}
            <View className="ml-3 flex-1 min-w-0">
              <Text className="font-medium text-foreground" numberOfLines={1}>{item.name}</Text>
              <Text className="text-muted text-xs" numberOfLines={1}>{item.url}</Text>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderAnimeItem = ({ item }: { item: Anime }) => {
    const isSelected = selectedAnime.some(c => c.id === item.id);
    return (
      <TouchableOpacity onPress={() => toggleAnime(item)} activeOpacity={0.7}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox checked={isSelected} onChange={() => toggleAnime(item)} />
            {item.thumbnail || item.imageUrl ? (
              <Image
                key={item.id + (item.thumbnail || item.imageUrl)}
                source={{ uri: item.thumbnail || item.imageUrl }}
                style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }} className="bg-default items-center justify-center">
                <IconifyIcon name="lucide:film" size={20} color={getThemeColor('foreground', isDark)} />
              </View>
            )}
            <View className="ml-3 flex-1 min-w-0">
              <Text className="font-medium text-foreground" numberOfLines={1}>{item.name}</Text>
              {item.groupName && (
                <Text className="text-muted text-xs">{item.groupName}</Text>
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
      <TouchableOpacity onPress={() => toggleWebsite(item)} activeOpacity={0.7}>
        <Card className="mb-2">
          <CardContent className="flex-row items-center">
            <Checkbox checked={isSelected} onChange={() => toggleWebsite(item)} />
            {(item.thumbnail || (item as any).imageUrl) ? (
              <Image
                key={item.id + (item.thumbnail || (item as any).imageUrl || '')}
                source={{ uri: item.thumbnail || (item as any).imageUrl }}
                style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }}
              />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 12, marginLeft: 12 }} className="bg-default items-center justify-center">
                <IconifyIcon name="lucide:globe" size={20} color={getThemeColor('foreground', isDark)} />
              </View>
            )}
            <View className="ml-3 flex-1 min-w-0">
              <Text className="font-medium text-foreground" numberOfLines={1}>{item.name}</Text>
              <Text className="text-muted text-xs" numberOfLines={1}>{item.url}</Text>
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
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ paddingTop: insets.top }} className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 pb-3 border-b" style={{ borderColor: getThemeColor('border', isDark) }}>
          <View className="flex-row items-center mb-1">
            <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.back(); }} className="mr-3 p-1.5 -ml-1 rounded-full" style={{ backgroundColor: getThemeColor('surface', isDark) }}>
              <IconifyIcon name="lucide:arrow-left" size={20} color={getThemeColor('foreground', isDark)} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground">Add Channels</Text>
          </View>
          <Text className="text-sm text-muted">{group?.name ? `Add channels to ${group.name}` : 'Select channels to add'}</Text>
        </View>

        {/* Tabs */}
        <View className="flex-row mx-5 mt-4 mb-3 bg-default rounded-xl p-1">
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 items-center rounded-lg ${activeTab === tab.key ? '' : ''}`}
            >
              <Text className={`font-medium text-sm ${activeTab === tab.key ? 'text-accent' : 'text-muted'}`}>
                {tab.label}
              </Text>
              {((tab.key === 'youtube' && selectedYoutube.length > 0) ||
                (tab.key === 'anime' && selectedAnime.length > 0) ||
                (tab.key === 'website' && selectedWebsites.length > 0)) && (
                <View className="bg-accent/20 px-1.5 py-0.5 rounded-md mt-0.5">
                  <Text className="text-xs text-accent font-semibold">
                    {tab.key === 'youtube' && selectedYoutube.length}
                    {tab.key === 'anime' && selectedAnime.length}
                    {tab.key === 'website' && selectedWebsites.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Search / URL Input */}
        <View className="px-5 pb-3">
          {activeTab !== 'website' ? (
            <TextInput
              placeholder="Search channels..."
              placeholderTextColor={getThemeColor('field-placeholder', isDark)}
              value={search}
              onChangeText={setSearch}
              className="rounded-xl"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <TextInput
                  placeholder="Paste website URL..."
                  placeholderTextColor={getThemeColor('field-placeholder', isDark)}
                  value={urlInput}
                  onChangeText={setUrlInput}
                  onSubmitEditing={handleFetchUrl}
                  className="rounded-xl"
                />
              </View>
              <TouchableOpacity
                onPress={handleFetchUrl}
                disabled={isFetchingUrl || !urlInput.trim()}
                className="bg-accent px-4 py-3 rounded-xl"
                activeOpacity={0.7}
              >
                {isFetchingUrl ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-accent-foreground font-semibold text-sm">Fetch</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* List */}
        <View className="flex-1 px-5">
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
            contentContainerStyle={{ paddingBottom: 160 }}
            ListFooterComponent={
              currentData?.fetchingNext ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color={getThemeColor('accent', isDark)} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              currentData?.loading ? (
                <View className="py-8 items-center">
                  <ActivityIndicator size="small" color={getThemeColor('accent', isDark)} />
                </View>
              ) : (
                <View className="py-12 items-center">
                  <IconifyIcon name="lucide:search-x" size={40} className="text-muted mb-3" />
                  <Text className="text-muted text-center font-medium">
                    No {activeTab === 'youtube' ? 'channels' : activeTab === 'anime' ? 'animes' : 'websites'} found
                  </Text>
                </View>
              )
            }
          />
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={{ paddingBottom: insets.bottom }} className="absolute bottom-0 left-0 right-0 px-5 py-3 bg-background border-t" style={{ borderColor: getThemeColor('border', isDark) }}>
        <Button onPress={handleSave} fullWidth loading={batchUpdateChannels.isPending}>
          {batchUpdateChannels.isPending ? 'Saving...' : `Add Selected (${totalSelected})`}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
