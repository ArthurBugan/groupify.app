import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGroupSubgroups } from '@/hooks';
import { Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function GroupSubgroupsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: subgroupsData } = useGroupSubgroups(id);

  const childGroups = subgroupsData?.data || [];

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <Button
          variant="secondary"
          onPress={() => router.push(`/groups/new?parentId=${id}`)}
          fullWidth
          className="mb-4"
        >
          Add Subgroup
        </Button>

        {childGroups.length === 0 ? (
          <Text className="text-center text-muted-foreground mt-10">No subgroups</Text>
        ) : (
          <View className="gap-2">
            {childGroups.map((childGroup) => (
              <TouchableOpacity
                key={childGroup.id}
                className="flex-row items-center gap-3 bg-card p-3 rounded-lg"
                onPress={() => router.push(`/groups/${childGroup.id}`)}
              >
                <View className="w-12 h-12 rounded-lg bg-secondary items-center justify-center">
                  <IconifyIcon name={getGroupIcon(childGroup.icon)} size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground font-medium">{childGroup.name}</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={20} className="text-muted-foreground" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}