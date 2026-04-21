import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroup } from '@/hooks';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShareGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { isDark } = useTheme();

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
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-primary">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-6">Share Group</Text>

      <Card>
        <CardContent>
          <Text className="text-muted-foreground mb-4">
            Share "{group?.name}" with others
          </Text>
          
          <Button onPress={handleShare} fullWidth>
            Share Now
          </Button>
        </CardContent>
      </Card>
      </SafeAreaView>
    </ScrollView>
  );
}