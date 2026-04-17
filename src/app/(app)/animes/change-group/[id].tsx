import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useAnime, useGroups } from '../../../../hooks';
import { Card, CardContent, Button } from '@/components/ui';

export default function ChangeAnimeGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: anime } = useAnime(id);
  const { data: groupsData } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState(anime?.groupId || '');

  const handleSave = () => {
    Alert.alert('Success', 'Group updated');
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Change Group</Text>

      <Text className="text-gray-600 mb-4">
        Select a group for "{anime?.name}"
      </Text>

      {groupsData?.data.map((group) => (
        <TouchableOpacity
          key={group.id}
          onPress={() => setSelectedGroupId(group.id)}
        >
          <Card className={`mb-2 ${selectedGroupId === group.id ? 'border-blue-500' : ''}`}>
            <CardContent>
              <Text className="font-medium">{group.name}</Text>
              {selectedGroupId === group.id && (
                <Text className="text-blue-500 text-sm mt-1">✓ Selected</Text>
              )}
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}

      <Button onPress={handleSave} fullWidth className="mt-4">
        Save
      </Button>
    </ScrollView>
  );
}