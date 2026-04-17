import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Input, Button, Card, CardContent, Select } from '@/components/ui';
import { useChannel, useUpdateChannel, useGroups } from '../../../../hooks';

export default function EditChannelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: channel, isLoading } = useChannel(id);
  const { data: groupsData } = useGroups();
  const updateChannel = useUpdateChannel();

  const [name, setName] = useState(channel?.name || '');
  const [description, setDescription] = useState(channel?.description || '');
  const [url, setUrl] = useState(channel?.url || '');
  const [groupId, setGroupId] = useState(channel?.groupId || '');

  const groupOptions = groupsData?.data.map((g) => ({ value: g.id, label: g.name })) || [];

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim()) {
      Alert.alert('Error', 'Name and URL are required');
      return;
    }
    try {
      await updateChannel.mutateAsync({
        id,
        data: { id, name, url, groupId },
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update channel');
    }
  };

  if (isLoading) {
    return <View className="flex-1 bg-gray-50 p-4" />;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <Button variant="ghost" onPress={() => router.back()}>
          ← Back
        </Button>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Edit Channel</Text>

      <Card>
        <CardContent>
          <Input
            label="Channel Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter channel name"
          />
          <Input
            label="URL"
            value={url}
            onChangeText={setUrl}
            placeholder="https://..."
            keyboardType="url"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={3}
          />
          <Select
            label="Group"
            value={groupId}
            onChange={setGroupId}
            options={groupOptions}
            placeholder="Select group"
          />
        </CardContent>
      </Card>

      <View className="flex-row gap-3 mt-6">
        <Button variant="outline" onPress={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button onPress={handleSubmit} loading={updateChannel.isPending} className="flex-1">
          Save
        </Button>
      </View>
    </ScrollView>
  );
}