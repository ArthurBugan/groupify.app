import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useWebsitesInfinite } from '@/hooks/useWebsitesInfinite';
import { useDeleteWebsite } from '@/hooks';
import { useTheme } from '@/theme/ThemeProvider';
import type { Website } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LegendList } from '@legendapp/list';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function WebsitesScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const deleteWebsite = useDeleteWebsite();

  const {
    websites,
    loadMore,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useWebsitesInfinite({ limit: 20, page: 1, search });

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
      className="bg-card rounded-xl p-4 mb-3 flex-row items-center gap-3"
      onPress={() => router.push(`/websites/edit/${item.id}`)}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} className="w-6 h-6 rounded-xl" />
      ) : (
        <View className="w-6 h-6 rounded-xl bg-secondary items-center justify-center">
          <IconifyIcon name="lucide:globe" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-lg font-semibold text-foreground">{item.name}</Text>
        <Text className="text-sm text-muted-foreground" numberOfLines={1}>{item.url}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <IconifyIcon name="lucide:trash-2" size={20} className="text-destructive" />
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
            <Text className="text-primary">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-3xl font-bold text-foreground mb-4">Websites</Text>

        <TextInput
          className="bg-card rounded-xl p-3 text-foreground mb-4"
          placeholder="Search websites..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
        />

        <LegendList
          data={websites || []}
          onEndReached={loadMore}
          renderItem={({ item }) => renderWebsite(item)}
          keyExtractor={(item, index) => String(item.id + index)}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <Text className="text-center text-muted-foreground mt-10">
              {isLoading ? 'Loading...' : 'No websites found.'}
            </Text>
          }
        />
      </View>
    </View>
  );
}