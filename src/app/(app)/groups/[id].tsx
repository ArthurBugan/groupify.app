import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroup, useDeleteGroup } from '@/hooks';
import { Card, CardContent, Badge, Avatar, Button, Skeleton } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group, isLoading } = useGroup(id);
  const deleteGroup = useDeleteGroup();

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

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 p-4">
        <Skeleton height={40} className="mb-4" />
        <Skeleton height={100} />
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 bg-gray-50 p-4 items-center justify-center">
        <Text className="text-gray-500">Group not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-blue-500">← Back</Text>
          </TouchableOpacity>
        </View>

        <DashboardHeader title={group.name} />

        <Card>
          <CardContent>
            {group.description && (
              <Text className="text-gray-600 mb-4">{group.description}</Text>
            )}
            <View className="flex-row items-center gap-2">
              <Badge variant={group.isActive ? 'success' : 'error'}>
                {group.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Text className="text-gray-500 text-sm">
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
    </ScrollView>
  );
}