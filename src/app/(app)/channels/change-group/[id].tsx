import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useChannel, useGroups } from '../../../../hooks';
import { Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function ChangeChannelGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: channel, isLoading } = useChannel(id);
  const { data: groupsData } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState(channel?.data?.groupId || '');
  const { isDark } = useTheme();

  const handleSave = () => {
    Alert.alert('Success', 'Group updated');
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

        <Text className="text-2xl font-bold text-foreground mb-4">Change Group</Text>

        {channel?.data?.groupName && (
          <View className="flex-row items-center gap-2 mb-4">
            <Text className="text-muted-foreground">Current group:</Text>
            <View className="flex-row items-center gap-2 bg-secondary px-3 py-1 rounded-lg">
              <IconifyIcon name={getGroupIcon(channel?.data?.groupIcon)} size={14} />
              <Text className="text-foreground text-sm">{channel.data.groupName}</Text>
            </View>
          </View>
        )}

        <View className="flex-row items-center gap-3 bg-card rounded-xl p-4 mb-6">
          {channel?.data?.thumbnail || channel?.data?.imageUrl ? (
            <Image source={{ uri: channel?.data?.thumbnail || channel?.data?.imageUrl }} className="w-16 h-16 rounded-xl" />
          ) : (
            <View className="w-16 h-16 rounded-xl bg-secondary items-center justify-center">
              <IconifyIcon name="lucide:tv" size={24} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground">{channel?.data?.name}</Text>
            {channel?.data?.description && (
              <Text className="text-sm text-muted-foreground" numberOfLines={2}>
                {channel.description}
              </Text>
            )}
          </View>
        </View>

        <Text className="text-muted-foreground mb-3">Select a group</Text>

        {groupsData?.data.map((group) => (
          <TouchableOpacity
            key={group.id}
            className={`flex-row items-center gap-3 bg-card rounded-xl p-4 mb-2 ${selectedGroupId === group.id ? 'border-2 border-blue-500' : ''}`}
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
              <IconifyIcon name="mdi:check-circle" size={24} color="#3b82f6" />
            )}
          </TouchableOpacity>
        ))}

        <Button onPress={handleSave} fullWidth className="mt-4">
          Save
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
}