import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { useShareLinks, useDeleteShareLink } from '@/hooks';
import { Card, CardContent, Button } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import type { ShareLink } from '@/types';
import { useTheme } from '@/theme/ThemeProvider';

export default function ShareLinksScreen() {
  const router = useRouter();
  const { data: response } = useShareLinks();
  const data = response?.data;
  const deleteShareLink = useDeleteShareLink();
  const { isDark } = useTheme();

  const handleShare = async (url: string) => {
    try {
      await Share.share({ message: url });
    } catch {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteShareLink.mutateAsync(id);
          } catch {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <DashboardHeader title="Share Links" />

      {data?.length === 0 ? (
        <Text className="text-muted-foreground text-center mt-8">No share links yet</Text>
      ) : (
        data?.map((link: ShareLink) => (
          <Card key={link.id} className="mb-2">
            <CardContent>
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text className="font-medium capitalize">{link.type}</Text>
                  <Text className="text-muted-foreground text-sm">{link.shareUrl}</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <Button size="sm" onPress={() => link.shareUrl && handleShare(link.shareUrl)}>
                  Share
                </Button>
                <Button size="sm" variant="danger" onPress={() => handleDelete(link.id)}>
                  Delete
                </Button>
              </View>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollView>
  );
}