import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAnime, useGroups, useUpdateChannel } from '@/hooks';
import { Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import AdMobManager from '@/components/ui/Admob';

export default function ChangeAnimeGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: anime, isLoading } = useAnime(id);
  const { data: groupsData } = useGroups({limit: 100});
  const [selectedGroupId, setSelectedGroupId] = useState(anime?.groupId || '');
  const updateAnime = useUpdateChannel();
  
  const handleSave = async () => {
        await updateAnime.mutateAsync({
      id,
      data: { id, thumbnail: anime?.thumbnail || anime?.imageUrl, name: anime?.name || '', url: anime?.url || '', groupId: selectedGroupId, contentType: 'anime' },
    });
    await AdMobManager.loadRewardedAd();
    router.back();
  };

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-primary">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-4">{anime?.groupName ? 'Change Group' : 'Add Group'}</Text>

        {anime?.groupName && (
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-muted-foreground">Current group:</Text>
            <View className="flex-row items-center gap-2 bg-secondary px-3 py-1 rounded-lg">
              <IconifyIcon name={getGroupIcon(anime?.groupIcon)} size={14} />
              <Text className="text-foreground text-sm">{anime.groupName}</Text>
            </View>
          </View>
        )}

        <View className="flex-row items-center gap-3 bg-card rounded-xl p-4 mb-6">
          {anime?.thumbnail || anime?.imageUrl ? (
            <Image source={{ uri: anime.thumbnail || anime.imageUrl }} className="w-16 h-16 rounded-xl" />
          ) : (
            <View className="w-16 h-16 rounded-xl bg-secondary items-center justify-center">
              <IconifyIcon name="lucide:film" size={24} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{anime?.name}</Text>
            {anime?.description && (
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                {anime.description}
              </Text>
            )}
          </View>
        </View>

        <Text className="text-muted-foreground mb-3">Select a group</Text>

        {groupsData?.data.map((group) => (
          <TouchableOpacity
            key={group.id}
            className={`flex-row items-center gap-3 bg-card rounded-xl p-4 mb-2 ${selectedGroupId === group.id ? 'border-2 border-primary' : ''}`}
            onPress={() => setSelectedGroupId(group.id)}
          >
            <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
              <IconifyIcon name={getGroupIcon(group.icon)} size={20} />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-foreground">{group.name}</Text>
              {group.description && (
                <Text className="text-sm text-muted-foreground" numberOfLines={1}>
                  {group.description}
                </Text>
              )}
            </View>
            {selectedGroupId === group.id && (
              <IconifyIcon name="mdi:check-circle" size={24} color="primary" />
            )}
          </TouchableOpacity>
        ))}

        <Button onPress={handleSave} fullWidth className="mt-4">
          Save
        </Button>
      </SafeAreaView >
    </ScrollView>
  );
}