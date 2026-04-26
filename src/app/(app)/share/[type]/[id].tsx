import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card, CardContent } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export default function SharedContentScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-foreground mb-4">Shared Content</Text>

      <Card>
        <CardContent>
          <Text className="text-muted-foreground capitalize">Type: {type}</Text>
          <Text className="text-muted-foreground mt-2">ID: {id}</Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}