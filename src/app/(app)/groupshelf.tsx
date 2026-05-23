import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { useGroupShelves, useCopyShelf } from '@/hooks/useGroupShelf';
import { useTheme } from '@/theme/ThemeProvider';
import { Skeleton } from '@/components/ui';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Icon } from '@/components/ui/Icons';
import type { Channel, Group } from '@/types';

export default function GroupShelfScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedShelf, setSelectedShelf] = useState<Group | null>(null);
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const { data, isLoading, error } = useGroupShelves({ search });
  const copyShelf = useCopyShelf();

  const handleCopy = (shelfId: string, shelfName: string) => {
    copyShelf.mutate(shelfId);
  };

  const openShelfDetails = (shelf: Group) => {
    setSelectedShelf(shelf);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedShelf(null);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    []
  );

  const renderChannel = (item: Channel) => (
    <TouchableOpacity
      key={item.id}
      className="bg-surface rounded-xl p-3 mb-2 flex-row items-center gap-3"
    >
      {item.thumbnail || item.imageUrl ? (
        <Image source={{ uri: item.thumbnail || item.imageUrl }} className="w-10 h-10 rounded-xl" />
      ) : (
        <View className="w-10 h-10 rounded-xl bg-default items-center justify-center">
          <Icon name="tv" size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-muted" numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
        
        <Text className="text-muted mb-4">Copy groups from other users</Text>

        <TextInput
          placeholder="Search groupshelf..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView className="flex-1">
          {isLoading ? (
            <View className="gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} className="bg-surface rounded-xl p-4">
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
            <View className="bg-surface rounded-xl p-6 items-center">
              <IconifyIcon name="lucide:alert-circle" size={48} className="text-danger mb-4" />
              <Text className="text-danger font-semibold">Error Loading Groupshelf</Text>
              <Text className="text-muted text-sm mt-2">{error.message || 'Failed to load groupshelf. Please try again.'}</Text>
            </View>
          ) : data?.data.length === 0 ? (
            <View className="bg-surface rounded-xl p-6 items-center">
              <IconifyIcon name="lucide:search-x" size={48} className="text-muted mb-4" />
              <Text className="text-muted text-center">
                {search ? `No groupshelf match "${search}"` : 'No groupshelf found'}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {data?.data.map(shelf => (
                <TouchableOpacity 
                  key={shelf.id} 
                  className="bg-surface rounded-xl p-4"
                  onPress={() => openShelfDetails(shelf)}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg bg-default items-center justify-center">
                      <IconifyIcon name={shelf.icon || 'lucide:folder'} size={20} className="text-muted" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-foreground">{shelf.name}</Text>
                      {shelf.description && shelf.description !== '' && (
                        <Text className="text-sm text-muted" numberOfLines={2}>
                          {shelf.description}
                        </Text>
                      )}
                      {shelf.category && (
                        <View className="flex-row items-center gap-2 mt-1">
                          <View className="bg-accent/20 px-2 py-0.5 rounded">
                            <Text className="text-xs text-accent">{shelf.category}</Text>
                          </View>
                        </View>
                      )}
                      <Text className="text-xs text-muted mt-1">
                        {shelf.channelCount || shelf.channels?.length || 0} channels • {shelf.createdAt ? new Date(shelf.createdAt).toLocaleDateString() : ''}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleCopy(shelf.id, shelf.name || 'Group')}
                      disabled={copyShelf.isPending}
                      className="bg-accent px-4 py-2 rounded-lg"
                    >
                      {copyShelf.isPending ? (
                        <ActivityIndicator size="small" className="text-accent-foreground" />
                      ) : (
                        <View className="flex-row items-center gap-2">
                          <IconifyIcon name="lucide:copy" size={16} className="text-accent-foreground" />
                          <Text className="text-accent-foreground font-semibold">Copy</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: '#1a1a1a' }}
        handleIndicatorStyle={{ backgroundColor: '#666' }}
        simultaneousHandlers={undefined}
      >
        <BottomSheetScrollView 
          className="flex-1 px-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          scrollEventThrottle={16}
        >
          {selectedShelf && (
            <View className="pb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-default items-center justify-center">
                    <IconifyIcon name={selectedShelf.icon || 'lucide:folder'} size={20} className="text-muted" />
                  </View>
                  <View>
                    <Text className="text-xl font-bold text-foreground">{selectedShelf.name}</Text>
                    <Text className="text-sm text-muted">
                      {selectedShelf.channels?.length || 0} channels
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={closeBottomSheet} className="p-2">
                  <IconifyIcon name="lucide:x" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {selectedShelf.description && (
                <Text className="text-muted mb-4">{selectedShelf.description}</Text>
              )}

              {selectedShelf.channels && selectedShelf.channels.length > 0 ? (
                <View className="gap-2">
                  {selectedShelf.channels.map(channel => renderChannel(channel))}
                </View>
              ) : (
                <View className="items-center py-8">
                  <IconifyIcon name="lucide:tv-off" size={48} className="text-muted mb-4" />
                  <Text className="text-muted">No channels in this group</Text>
                </View>
              )}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}
