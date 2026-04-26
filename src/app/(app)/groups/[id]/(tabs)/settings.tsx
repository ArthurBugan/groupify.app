import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useGroup, useDeleteGroup } from '@/hooks';
import { Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupSettingsScreen() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
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

  console.log(group, id)

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <Text className="text-xl font-semibold text-foreground mb-4">Settings</Text>

        <View className="gap-3">
          <TouchableOpacity
            className="bg-card p-4 rounded-lg"
            onPress={() => router.push(`/groups/${id}/edit`)}
          >
            <Text className="text-foreground font-medium">Edit Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-card p-4 rounded-lg"
            onPress={() => router.push(`/groups/${id}/share`)}
          >
            <Text className="text-foreground font-medium">Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-destructive p-4 rounded-lg"
            onPress={handleDelete}
          >
            <Text className="text-white font-medium">Delete Group</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}