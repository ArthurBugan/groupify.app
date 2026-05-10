import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import { useGroupShelves, useCopyShelf } from '@/hooks/useGroupShelf';
import { useTheme } from '@/theme/ThemeProvider';
import { Skeleton } from '@/components/ui';

export default function GroupShelfScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useGroupShelves({ search });
  const copyShelf = useCopyShelf();

  const handleCopy = (shelfId: string, shelfName: string) => {
    copyShelf.mutate(shelfId);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="flex-1 p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <IconifyIcon name="lucide:arrow-left" size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-foreground">Groupshelf</Text>
        </View>
        
        <Text className="text-muted-foreground mb-4">Copy groups from other users</Text>

        <TextInput
          className="bg-card rounded-xl p-3 text-foreground mb-4"
          placeholder="Search groupshelf..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView className="flex-1">
          {isLoading ? (
            <View className="gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} className="bg-card rounded-xl p-4">
                  <View className="flex-row items-center gap-3">
                    <Skeleton width={40} height={40} className="rounded-lg" />
                    <View className="flex-1 gap-2">
                      <Skeleton height={16} className="w-3/4 rounded" />
                      <Skeleton height={12} className="w-1/2 rounded" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : error ? (
            <View className="bg-card rounded-xl p-6 items-center">
              <IconifyIcon name="lucide:alert-circle" size={48} className="text-destructive mb-4" />
              <Text className="text-destructive font-semibold">Error Loading Groupshelf</Text>
              <Text className="text-muted-foreground text-sm mt-2">{error.message || 'Failed to load groupshelf. Please try again.'}</Text>
            </View>
          ) : data?.data.length === 0 ? (
            <View className="bg-card rounded-xl p-6 items-center">
              <IconifyIcon name="lucide:search-x" size={48} className="text-muted-foreground mb-4" />
              <Text className="text-muted-foreground text-center">
                {search ? `No groupshelf match "${search}"` : 'No groupshelf found'}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {data?.data.map(shelf => (
                <View key={shelf.id} className="bg-card rounded-xl p-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
                      <IconifyIcon name={shelf.icon || 'lucide:folder'} size={20} className="text-muted-foreground" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">{shelf.name}</Text>
                      {shelf.description && shelf.description !== '' && (
                        <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                          {shelf.description}
                        </Text>
                      )}
                      {shelf.category && (
                        <View className="flex-row items-center gap-2 mt-1">
                          <View className="bg-primary/20 px-2 py-0.5 rounded">
                            <Text className="text-xs text-primary">{shelf.category}</Text>
                          </View>
                        </View>
                      )}
                      <Text className="text-xs text-muted-foreground mt-1">
                        {shelf.channelCount || shelf.channels?.length || 0} channels • {shelf.createdAt ? new Date(shelf.createdAt).toLocaleDateString() : ''}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCopy(shelf.id, shelf.name || 'Group')}
                      disabled={copyShelf.isPending}
                      className="bg-primary px-4 py-2 rounded-lg"
                    >
                      {copyShelf.isPending ? (
                        <ActivityIndicator size="small" className="text-primary-foreground" />
                      ) : (
                        <View className="flex-row items-center gap-2">
                          <IconifyIcon name="lucide:copy" size={16} className="text-primary-foreground" />
                          <Text className="text-primary-foreground font-semibold">Copy</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
