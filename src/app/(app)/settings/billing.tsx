import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardContent, Button, Badge } from '@/components/ui';

export default function BillingScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-6">Billing</Text>

      <Card>
        <CardContent>
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-semibold">Free Plan</Text>
              <Text className="text-gray-500">Current plan</Text>
            </View>
            <Badge variant="success">Active</Badge>
          </View>
        </CardContent>
      </Card>

      <Text className="text-lg font-semibold mt-6 mb-3">Upgrade Plans</Text>

      <Card>
        <CardContent>
          <Text className="font-semibold mb-1">Pro - $9.99/month</Text>
          <Text className="text-gray-500 text-sm mb-3">Unlimited groups & channels</Text>
          <Button size="sm">Upgrade</Button>
        </CardContent>
      </Card>

      <Text className="text-lg font-semibold mt-6 mb-3">Billing History</Text>
      <Text className="text-gray-500">No billing history</Text>
    </ScrollView>
  );
}