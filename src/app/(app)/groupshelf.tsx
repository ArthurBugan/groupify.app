import { View, Text, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useGroupShelf, useGroups, useUpdateGroupShelf } from '@/hooks';
import { Card, CardContent, Button, Checkbox } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import type { Group } from '@/types';
import { useTheme } from '@/theme/ThemeProvider';

export default function GroupShelfScreen() {
  const router = useRouter();
  const { data: shelfData, isLoading } = useGroupShelf();
  const { data: groupsData } = useGroups();
  const updateGroupShelf = useUpdateGroupShelf();
  const [selectedIds, setSelectedIds] = useState<string[]>(shelfData?.groupIds || []);
  const { isDark } = useTheme();

  const toggleGroup = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await updateGroupShelf.mutateAsync({ groupIds: selectedIds });
      Alert.alert('Success', 'Shelf updated');
    } catch {
      Alert.alert('Error', 'Failed to update shelf');
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <DashboardHeader title="My Shelf" description="Select groups for your shelf" />

      {groupsData?.data.map((group) => (
        <TouchableOpacity key={group.id} onPress={() => toggleGroup(group.id)}>
          <Card className="mb-2">
            <CardContent className="flex-row items-center">
              <Checkbox
                checked={selectedIds.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
              />
              <Text className="ml-3 font-medium">{group.name}</Text>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}

      <Button onPress={handleSave} loading={updateGroupShelf.isPending} fullWidth className="mt-4">
        Save ({selectedIds.length} selected)
      </Button>
    </ScrollView>
  );
}