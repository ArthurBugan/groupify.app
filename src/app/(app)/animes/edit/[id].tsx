import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Input, Button, Card, CardContent, Select } from '@/components/ui';
import { useAnime, useGroups } from '../../../../hooks';
import { useTheme } from '@/theme/ThemeProvider';

export default function EditAnimeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: anime, isLoading } = useAnime(id);
  const { data: groupsData } = useGroups();
  const { isDark } = useTheme();

  const [name, setName] = useState(anime?.name || '');
  const [description, setDescription] = useState(anime?.description || '');
  const [groupId, setGroupId] = useState(anime?.groupId || '');

  const groupOptions = groupsData?.data.map((g) => ({ value: g.id, label: g.name })) || [];

  const handleSubmit = async () => {
    Alert.alert('Success', 'Anime updated');
    router.back();
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

      <Text className="text-2xl font-bold text-foreground mb-6">Edit Anime</Text>

      <Card>
        <CardContent>
          <Input
            label="Anime Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter anime name"
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
        <Button onPress={handleSubmit} className="flex-1">
          Save
        </Button>
      </View>
    </ScrollView>
  );
}