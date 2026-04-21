import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useWebsites, useDeleteWebsite } from '@/hooks';
import { Card, CardContent, Button } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import type { Website } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WebsitesScreen() {
  const router = useRouter();
  const { data } = useWebsites();
  const deleteWebsite = useDeleteWebsite();
  const insets = useSafeAreaInsets();

  const handleDelete = (id: string) => {
    Alert.alert('Delete Website', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWebsite.mutateAsync(id);
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };



  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}>

        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-blue-500">← Back</Text>
          </TouchableOpacity>
        </View>

        <DashboardHeader title="Websites" />

        {data?.data.length === 0 ? (
          <Text className="text-muted-foreground text-center mt-8">No websites yet</Text>
        ) : (
          data?.data.map((website: Website) => (
            <Card key={website.id} className="mb-2">
              <CardContent className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-medium">{website.name}</Text>
                  <Text className="text-muted-foreground text-sm">{website.url}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(website.id)}>
                  <Text className="text-red-500">🗑️</Text>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}