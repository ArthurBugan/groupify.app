import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroups } from '../../../hooks';
import { Card, CardContent, Button } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export default function GroupSettingsScreen() {
  const router = useRouter();
  const { data } = useGroups();
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-primary">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-6">Group Settings</Text>

      <Text className="text-muted-foreground mb-4">Manage your groups preferences</Text>

      {data?.data.length === 0 ? (
        <Text className="text-muted-foreground text-center mt-8">No groups yet</Text>
      ) : (
        data?.data.map((group) => (
          <Card key={group.id} className="mb-2">
            <CardContent className="flex-row items-center justify-between">
              <View>
                <Text className="font-medium">{group.name}</Text>
                <Text className="text-muted-foreground text-sm">
                  {group.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => router.push(`/groups/${group.id}/edit`)}>
                <Text className="text-primary">Edit</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        ))
      )}
    </ScrollView>
  );
}