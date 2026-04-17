import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroup } from '../../../../hooks';
import { Card, CardContent, Button, Badge } from '@/components/ui';

export default function ShareGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this group: ${group?.name}`,
      });
    } catch {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Share Group</Text>

      <Card>
        <CardContent>
          <Text className="text-gray-600 mb-4">
            Share "{group?.name}" with others
          </Text>
          
          <Button onPress={handleShare} fullWidth>
            Share Now
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}