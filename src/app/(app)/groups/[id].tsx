import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroup, useDeleteGroup } from '@/hooks';
import { Card, CardContent, Badge, Avatar, Button, Skeleton } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group, isLoading } = useGroup(id);
  const deleteGroup = useDeleteGroup();
  const { isDark } = useTheme();

  const handleDelete = () => {
    Alert.alert('Delete Group', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGroup.mutateAsync(id);
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to delete group');
          }
        },
      },
    ]);
  };

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'mdi:folder-group';
  };

  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-background">
        <SafeAreaView edges={['top']}>
          <View className="flex-1 bg-background p-4">
            <Skeleton height={40} className="mb-4" />
            <Skeleton height={100} />
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }

  if (!group) {
    return (
      <ScrollView className="flex-1 bg-background">
        <SafeAreaView edges={['top']}>
          <View className="flex-1 bg-background p-4 items-center justify-center">
            <Text className="text-muted-foreground">Group not found</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <SafeAreaView edges={['top']}>
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-2">
              <Text className="text-blue-500">← Back</Text>
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
          </View>

          <Card>
            <CardContent>
              {group.description && (
                <Text className="text-muted-foreground mb-4">{group.description}</Text>
              )}
              <View className="flex-row items-center gap-2">
                <Badge variant={group.isActive ? 'success' : 'error'}>
                  {group.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Text className="text-muted-foreground text-sm">
                  Order: {group.displayOrder}
                </Text>
              </View>
            </CardContent>
          </Card>

          <View className="flex-row gap-3 mt-6">
            <Button
              variant="outline"
              onPress={() => router.push(`/groups/${id}/edit`)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push(`/groups/${id}/share`)}
              className="flex-1"
            >
              Share
            </Button>
            <Button variant="danger" onPress={handleDelete} className="flex-1">
              Delete
            </Button>
          </View>

          {group.channels && group.channels.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-foreground mb-3">Channels ({group.channels.length})</Text>
              <View className="gap-2">
                {group.channels.map((channel) => (
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
                      {channel.contentType && (
                        <Text className="text-muted-foreground text-sm">{channel.contentType}</Text>
                      )}
                    </View>
                    <Badge variant={channel.isActive ? 'success' : 'error'}>
                      {channel.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View className="mt-6">
            <Button
              variant="secondary"
              onPress={() => router.push(`/groups/${id}/add-channel`)}
              fullWidth
            >
              Add Channels
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}