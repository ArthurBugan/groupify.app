import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useWebsitesInfinite } from '@/hooks/useWebsitesInfinite';
import { useDeleteWebsite } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Website } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { Skeleton } from '@/components/ui';
import { FlashList } from '@shopify/flash-list';

export default function WebsitesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const deleteWebsite = useDeleteWebsite();

  const {
    websites,
    loadMore,
    isFetchingNextPage,
    isLoading
  } = useWebsitesInfinite({ limit: 20, page: 1, search });

  console.log(websites)

  const handleDelete = (id: string) => {
    Alert.alert('Delete Website', 'Are you sure?', [
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
      className="bg-surface rounded-xl p-4 mb-3 flex-row items-center gap-3"
      onPress={() => router.push(`/websites/edit/${item.id}`)}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} className="w-6 h-6 rounded-xl" />
      ) : (
        <View className="w-6 h-6 rounded-xl bg-default items-center justify-center">
          <IconifyIcon name="lucide:globe" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        <Text className="text-sm text-muted" numberOfLines={1}>{item.url}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <IconifyIcon name="lucide:trash-2" size={20} className="text-danger" />
      </TouchableOpacity>
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
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
    >
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-bold text-foreground mb-4">Websites</Text>

        <TextInput
          placeholder="Search websites..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
        />

        <FlashList
          data={websites || []}
          onEndReached={loadMore}
          renderItem={(item) => renderWebsite(item)}
          keyExtractor={(item, index) => String(item.id + index)}
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
                <IconifyIcon name="lucide:globe" size={48} className="text-muted mb-4" />
                <Text className="text-muted text-center">No websites found.</Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
}