import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useWebsitesInfinite } from '@/hooks/useWebsitesInfinite';
import { useDeleteWebsite } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Website } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { Skeleton } from '@/components/ui';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'react-native';
import { getThemeColor } from '@/theme/themeColors';
import * as Haptics from 'expo-haptics';
import DashboardHeader from '@/components/DashboardHeader';

export default function WebsitesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const deleteWebsite = useDeleteWebsite();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    websites,
    loadMore,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useWebsitesInfinite({ limit: 20, page: 1, search });

  const handleRefresh = useCallback(async () => {
    Haptics.selectionAsync();
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const handleDelete = (id: string, name: string) => {
    Haptics.selectionAsync();
    Alert.alert('Delete Website', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWebsite.mutateAsync(id);
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  const renderWebsite = ({ item }: { item: Website }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-3.5 mb-2 flex-row items-center gap-3"
      onPress={() => { Haptics.selectionAsync(); router.push(`/websites/edit/${item.id}`); }}
      activeOpacity={0.7}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={{ width: 44, height: 44, borderRadius: 12 }} />
      ) : (
        <View className="w-11 h-11 rounded-xl items-center justify-center" style={{ backgroundColor: getThemeColor('default', isDark) }}>
          <IconifyIcon name="lucide:globe" size={20} color={getThemeColor('foreground', isDark)} />
        </View>
      )}
      <View className="flex-1 min-w-0">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>{item.name}</Text>
        <Text className="text-xs text-muted" numberOfLines={1}>{item.url}</Text>
      </View>
      <TouchableOpacity 
        onPress={(e) => { e.stopPropagation(); handleDelete(item.id, item.name); }}
        className="w-9 h-9 rounded-lg items-center justify-center"
        style={{ backgroundColor: `${getThemeColor('danger', isDark)}15` }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        activeOpacity={0.7}
      >
        <IconifyIcon name="lucide:trash-2" size={16} color={getThemeColor('danger', isDark)} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={getThemeColor('accent', isDark)} />
      </View>
    );
  };

  const renderSkeleton = () => (
    <View className="gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} className="bg-surface rounded-xl p-3.5 flex-row items-center gap-3">
          <Skeleton width={44} height={44} className="rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton height={16} className="w-3/4 rounded-lg" />
            <Skeleton height={12} className="w-1/2 rounded-lg" />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor={getThemeColor('accent', isDark)}
            colors={[getThemeColor('accent', isDark)]}
          />
        }
      >
        <View style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>
          <View className="pt-4 pb-2">
            <DashboardHeader title="Websites" />
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Search websites..."
              placeholderTextColor={getThemeColor('field-placeholder', isDark)}
              value={search}
              onChangeText={setSearch}
              className="rounded-xl"
            />
          </View>

          {isLoading ? (
            renderSkeleton()
          ) : (websites?.length || 0) === 0 ? (
            <View className="py-16 items-center">
              <View className="w-16 h-16 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                <IconifyIcon name="lucide:globe" size={32} color={getThemeColor('muted', isDark)} />
              </View>
              <Text className="text-muted text-center font-medium">No websites found</Text>
            </View>
          ) : (
            <FlashList
              data={websites || []}
              onEndReached={loadMore}
              renderItem={(item) => renderWebsite(item)}
              keyExtractor={(item, index) => String(item.id + index)}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
