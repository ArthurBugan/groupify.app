import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../../hooks';
import { Card, CardContent, Button } from '@/components/ui';

export default function GroupSettingsScreen() {
  const router = useRouter();
  const { data } = useGroups();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Group Settings</Text>

      <Text className="text-gray-500 mb-4">Manage your groups preferences</Text>

      {data?.data.length === 0 ? (
        <Text className="text-gray-500 text-center mt-8">No groups yet</Text>
      ) : (
        data?.data.map((group) => (
          <Card key={group.id} className="mb-2">
            <CardContent className="flex-row items-center justify-between">
              <View>
                <Text className="font-medium">{group.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {group.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push(`/groups/${group.id}/edit`)}>
                <Text className="text-blue-500">Edit</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollView>
  );
}