import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useAnimesInfinite } from '@/hooks/useAnimesInfinite';
import { useTheme } from '@/theme/ThemeProvider';
import type { Anime } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icons';
import { LegendList } from '@legendapp/list';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import { useMemo } from 'react';
import { InlineAd } from '@/components/ui/Admob';
import { Skeleton } from '@/components/ui';

type ListItem = Anime | { isAd: true; id: string };

const openCrunchyroll = (url: string) => {
  Linking.canOpenURL('crunchyroll://')
    .then((supported) => {
      if (supported) {
        Linking.openURL('crunchyroll://').catch(() => {
          Linking.openURL(url);
        });
      } else {
        Linking.openURL(url);
      }
    })
    .catch(() => {
      Linking.openURL(url);
    });
};

export default function AnimesListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const {
    animes,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    search,
    setSearch,
    refetch,
  } = useAnimesInfinite();

  const animesWithAds = useMemo(() => {
    if (!animes) return [];
    const result: ListItem[] = [];
    animes.forEach((anime, index) => {
      result.push(anime);
      if ((index + 1) % 5 === 0) {
        result.push({ isAd: true, id: `ad-${index}` });
      }
    });
    return result;
  }, [animes]);

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  const renderAnime = ({ item }: { item: Anime }) => (
    <TouchableOpacity
      className="bg-card rounded-xl p-1.5 mb-2 flex-row items-center gap-3"
      onPress={() => router.push(`/animes/change-group/${item.id}`)}
    >
      {item.thumbnail || item.imageUrl ? (
        <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-10 h-10 rounded-xl" />
      ) : (
        <View className="w-10 h-10 rounded-xl bg-secondary items-center justify-center">
          <Icon name="film" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-muted-foreground mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.groupIcon && (
          <View className="flex-row items-center gap-1 mt-1">
            <IconifyIcon name={getGroupIcon(item.groupIcon)} size={12} />
            <Text className="text-xs text-muted-foreground">{item.groupName}</Text>
          </View>
        )}
      </View>
      {item.url && (
        <TouchableOpacity
          onPress={() => openCrunchyroll(item.url!)}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconifyIcon color={'hsl(152 62% 52%)'} name="lucide:external-link" size={18} />
        </TouchableOpacity>
      )}
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
      <Text className="text-3xl font-bold text-foreground mb-4 pl-4">Animes</Text>

      <View className="mb-4 p-4">
        <TextInput
          className="bg-card rounded-xl p-3 text-foreground"
          placeholder="Search animes..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={refetch}
        />
      </View>

      <LegendList
        data={animesWithAds}
        renderItem={({ item }) => {
          if ('isAd' in item) {
            return <InlineAd />;
          }
          return renderAnime({ item });
        }}
        keyExtractor={(item, index) => item.id + index}
        className="p-4 pt-0"
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} className="bg-card rounded-xl p-4 flex-row items-center gap-3">
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
              <IconifyIcon name="lucide:film" size={48} className="text-muted-foreground mb-4" />
              <Text className="text-muted-foreground text-center">No animes found.</Text>
            </View>
          )
        }
      />
    </View>
  );
}
