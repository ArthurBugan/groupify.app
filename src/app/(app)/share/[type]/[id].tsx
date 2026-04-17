import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, CardContent } from '@/components/ui';

export default function SharedContentScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Shared Content</Text>

      <Card>
        <CardContent>
          <Text className="text-gray-500 capitalize">Type: {type}</Text>
          <Text className="text-gray-500 mt-2">ID: {id}</Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}