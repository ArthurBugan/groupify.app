import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroup, useGroupSubgroups } from '@/hooks';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function GroupOverviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { data: subgroupsData } = useGroupSubgroups(id);


  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  if (!group) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">Loading...</Text>
      </View>
    );
  }


  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-primary">← Back</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-3 mb-4">
          <View className="w-16 h-16 rounded-xl bg-card items-center justify-center">
            <IconifyIcon name={getGroupIcon(group.icon)} size={32} />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">{group.name}</Text>
            {group.category && (
              <Text className="text-muted-foreground">{group.category}</Text>
            )}
          </View>
          <Button
            onPress={() => router.push(`/groups/${id}/add-channel`)}
            variant="secondary"
          >
            <View className='flex-row justify-center items-center gap-2'>
              <IconifyIcon name="lucide:plus" size={20} />
              <Text className="text-md mt-1 font-bold text-foreground">Add Channel</Text>
            </View>
          </Button>
        </View>

        <Card>
          <CardContent className="bg-card rounded-xl">
            {group.description ? (
              <Text className="text-muted-foreground">{group.description}</Text>
            ) : (
              <Text className="text-muted-foreground">No description</Text>
            )}
          </CardContent>
        </Card>

        {subgroupsData?.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Subgroups ({subgroupsData?.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {subgroupsData?.map((childGroup) => (
                <TouchableOpacity
                  key={childGroup.id}
                  className="w-20 items-center gap-2 bg-card p-1.5 rounded-lg mx-1"
                  onPress={() => router.push(`/groups/${childGroup.id}`)}
                >
                  <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
                    <IconifyIcon name={getGroupIcon(childGroup.icon)} size={16} />
                  </View>
                  <Text className="text-xs text-foreground text-center" numberOfLines={2}>
                    {childGroup.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {group.channels && group.channels.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Channels ({group.channels.length})
            </Text>
            <View className="gap-2">
              {group.channels.slice(0, 5).map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  className="flex-row items-center gap-3 bg-card p-3 rounded-lg"
                  onPress={() => router.push(`/channels/edit/${channel.id}`)}
                >
                  {channel.thumbnail || channel.imageUrl ? (
                    <Image
                      source={{ uri: channel.thumbnail || channel.imageUrl }}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-lg bg-secondary items-center justify-center">
                      <IconifyIcon name="mdi:television-play" size={20} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">{channel.name}</Text>
                  </View>
                  <Badge variant={channel.isActive ? 'success' : 'error'}>
                    {channel.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}


      </SafeAreaView>
    </ScrollView>
  );
}