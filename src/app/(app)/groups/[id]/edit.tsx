import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Input, Button, Switch, Card, CardContent } from '@/components/ui';
import { useGroup, useUpdateGroup } from '../../../../hooks';
import { useTheme } from '@/theme/ThemeProvider';

export default function EditGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group, isLoading } = useGroup(id);
  const updateGroup = useUpdateGroup();
  const { isDark } = useTheme();
  
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [isActive, setIsActive] = useState(group?.isActive ?? true);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Group name is required');
      return;
    }
    try {
      await updateGroup.mutateAsync({ id, data: { name, description } });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update group');
    }
  };

  if (isLoading) {
    return <View className="flex-1 bg-background p-4" />;
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <Button variant="ghost" onPress={() => router.back()}>
          ← Back
        </Button>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-6">Edit Group</Text>

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
            <Text className="text-foreground">Active</Text>
            <Switch value={isActive} onValueChange={setIsActive} />
          </View>
        </CardContent>
      </Card>

      <View className="flex-row gap-3 mt-6">
        <Button variant="outline" onPress={() => router.back()} className="flex-1">
          Cancel
        </Button>
        <Button onPress={handleSubmit} loading={updateGroup.isPending} className="flex-1">
          Save
        </Button>
      </View>
    </ScrollView>
  );
}