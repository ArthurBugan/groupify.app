import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Input, Button, Select, Switch, Card, CardContent } from '@/components/ui';
import { useCreateGroup } from '@/hooks';

export default function CreateGroupScreen() {
  const router = useRouter();
  const createGroup = useCreateGroup();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }
    try {
      await createGroup.mutateAsync({ name, description });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <Button variant="ghost" onPress={() => router.back()}>
          ← Back
        </Button>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Create Group</Text>

      <Card>
        <CardContent>
          <Input
            label="Group Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter group name"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
          />
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-gray-700 dark:text-gray-300">Public Group</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
        </CardContent>
      </Card>

      <View className="flex-row gap-3 mt-6">
        <Button variant="outline" onPress={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button onPress={handleSubmit} loading={createGroup.isPending} className="flex-1">
          Create
        </Button>
      </View>
    </ScrollView>
  );
}