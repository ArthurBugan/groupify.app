import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useChannel, useGroups } from '../../../../hooks';
import { Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export default function ChangeChannelGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: channel } = useChannel(id);
  const { data: groupsData } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState(channel?.groupId || '');
  const { isDark } = useTheme();

  const handleSave = () => {
    Alert.alert('Success', 'Group updated');
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-6">Change Group</Text>

      <Text className="text-muted-foreground mb-4">
        Select a group for "{channel?.name}"
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