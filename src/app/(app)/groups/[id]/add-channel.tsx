import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useGroup } from '../../../../hooks';
import { useChannelsInfinite } from '../../../../hooks/useChannelsInfinite';
import { useAnimesInfinite } from '../../../../hooks/useAnimesInfinite';
import { channelsApi } from '../../../../api/endpoints/channels';
import { Card, CardContent, Checkbox, Button, Input } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LegendList } from '@legendapp/list';
import type { Channel, Anime } from '@/types';
import { Icon } from '@/components/ui/Icons';

const TABS = [
  { key: 'youtube', label: 'YouTube' },
  { key: 'anime', label: 'Animes' },
  { key: 'website', label: 'Website' },
];

export default function AddChannelToGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const [activeTab, setActiveTab] = useState('youtube');
  const [search, setSearch] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedChannel, setFetchedChannel] = useState<Channel | null>(null);
  const { isDark } = useTheme();

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

  const filteredChannels = channels?.filter(ch => {
    if (activeTab === 'youtube') return ch.contentType === 'youtube' || !ch.contentType;
    if (activeTab === 'anime') return ch.contentType === 'anime';
    if (activeTab === 'website') return ch.contentType === 'website';
    return true;
  }) || [];

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((c) => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleFetchWebsite = async () => {
    if (!websiteUrl.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setIsFetching(true);
    try {
      const result = await channelsApi.fetchUrl(websiteUrl);
      setFetchedChannel(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch website data');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = () => {
    Alert.alert('Success', 'Channels added to group');
    router.back();
  };

  const renderChannelItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity onPress={() => toggleChannel(item.id)}>
      <Card className="mb-2">
        <CardContent className="flex-row items-center">
          <Checkbox
            checked={selectedChannels.includes(item.id)}
            onChange={() => toggleChannel(item.id)}
          />
          {item.thumbnail || item.imageUrl ? (
            <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-12 h-12 rounded-lg ml-3" />
          ) : (
            <View className="w-12 h-12 rounded-lg bg-secondary items-center justify-center ml-3">
              <Icon name="tv" size={20} />
            </View>
          )}
          <View className="ml-3 flex-1">
            <Text className="font-medium text-foreground">{item.name}</Text>
            <Text className="text-muted-foreground text-sm" numberOfLines={1}>{item.url}</Text>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  const renderAnimeItem = ({ item }: { item: Anime }) => (
    <TouchableOpacity onPress={() => toggleChannel(item.id)}>
      <Card className="mb-2">
        <CardContent className="flex-row items-center">
          <Checkbox
            checked={selectedChannels.includes(item.id)}
            onChange={() => toggleChannel(item.id)}
          />
          {item.thumbnail || item.imageUrl ? (
            <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-12 h-12 rounded-lg ml-3" />
          ) : (
            <View className="w-12 h-12 rounded-lg bg-secondary items-center justify-center ml-3">
              <Icon name="tv" size={20} />
            </View>
          )}
          <View className="ml-3 flex-1">
            <Text className="font-medium text-foreground">{item.name}</Text>
            {item.groupName && (
              <Text className="text-muted-foreground text-sm">{item.groupName}</Text>
            )}
          </View>
        </CardContent>
      </Card>
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

  const renderAnimesFooter = () => {
    if (!isFetchingNextPageAnimes) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']} className="flex-1 p-4 pb-0">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-primary">← Back</Text>
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
              className={`flex-1 py-3 items-center ${
                activeTab === tab.key ? 'border-b-2 border-primary' : ''
              }`}
            >
              <Text
                className={`font-medium ${
                  activeTab === tab.key ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab !== 'website' && (
          <TextInput
            className="bg-card rounded-xl p-3 text-foreground mb-4"
            placeholder="Search channels..."
            placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
            value={search}
            onChangeText={setSearch}
          />
        )}

        {activeTab === 'youtube' && (
          <LegendList
            data={filteredChannels}
            onEndReached={loadMore}
            renderItem={renderChannelItem}
            keyExtractor={(item, index) => String(item.id + index)}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              <Text className="text-center text-muted-foreground mt-10">
                {isLoading ? 'Loading...' : 'No channels found.'}
              </Text>
            }
          />
        )}

        {activeTab === 'anime' && (
          <LegendList
            data={animes || []}
            onEndReached={loadMoreAnimes}
            renderItem={renderAnimeItem}
            keyExtractor={(item, index) => String(item.id + index)}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderAnimesFooter}
            ListEmptyComponent={
              <Text className="text-center text-muted-foreground mt-10">
                {isLoadingAnimes ? 'Loading...' : 'No animes found.'}
              </Text>
            }
          />
        )}

        {activeTab === 'website' && (
          <View>
            <Input
              value={websiteUrl}
              onChangeText={setWebsiteUrl}
              placeholder="Enter website URL..."
              className="mb-3"
            />
            <Button onPress={handleFetchWebsite} disabled={isFetching} fullWidth>
              {isFetching ? 'Fetching...' : 'Fetch'}
            </Button>

            {fetchedChannel && (
              <Card className="mt-4">
                <CardContent className="flex-row items-center">
                  <Checkbox
                    checked={selectedChannels.includes(fetchedChannel.id)}
                    onChange={() => toggleChannel(fetchedChannel.id)}
                  />
                  {fetchedChannel.thumbnail || fetchedChannel.imageUrl ? (
                    <Image source={{ uri: fetchedChannel.thumbnail || fetchedChannel.imageUrl }} className="w-12 h-12 rounded-lg ml-3" />
                  ) : (
                    <View className="w-12 h-12 rounded-lg bg-secondary items-center justify-center ml-3">
                      <Icon name="tv" size={20} />
                    </View>
                  )}
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-foreground">{fetchedChannel.name}</Text>
                    <Text className="text-muted-foreground text-sm" numberOfLines={1}>{fetchedChannel.url}</Text>
                  </View>
                </CardContent>
              </Card>
            )}
          </View>
        )}
      </SafeAreaView>

      <Button onPress={handleSave} fullWidth>
        Add Selected ({selectedChannels.length})
      </Button>
    </View>
  );
}
