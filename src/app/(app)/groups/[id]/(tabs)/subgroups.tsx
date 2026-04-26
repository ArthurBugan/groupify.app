import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useGroupSubgroups } from '@/hooks';
import { Button } from '@/components/ui';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import { FlashList } from '@shopify/flash-list';

export default function GroupSubgroupsScreen() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data: subgroupsData } = useGroupSubgroups(id);
  const insets = useSafeAreaInsets();

  const childGroups = subgroupsData || [];
  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  const renderItem = ({ item }: { item: typeof childGroups[0] }) => (
    <TouchableOpacity
      className="flex-row items-center gap-3 bg-card rounded-2xl p-4 mx-2 mb-2"
      onPress={() => router.push(`/groups/${item.id}`)}
    >
      <View className="w-12 h-12 rounded-xl bg-secondary items-center justify-center">
        <IconifyIcon name={getGroupIcon(item.icon)} size={22} />
      </View>
      <View className="flex-1">
        <Text className="text-base text-foreground font-semibold">{item.name}</Text>
      </View>
      <IconifyIcon name="lucide:chevron-right" size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-background p-4">

      <SafeAreaView edges={['top']}>
        <Text className="text-2xl font-bold text-foreground mb-1">Subgroups</Text>
        <Text className="text-sm text-muted-foreground mb-4">
          {childGroups.length} subgroup{childGroups.length !== 1 ? 's' : ''}
        </Text>

        <Button
          variant="secondary"
          onPress={() => router.push(`/groups/new?parentId=${id}`)}
          fullWidth
          className="mb-4"
        >
          Add Subgroup
        </Button>

        {childGroups.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <IconifyIcon name="lucide:folder-open" size={48} className="text-muted-foreground" />
            <Text className="text-muted-foreground mt-3">No subgroups yet</Text>
            <Text className="text-xs text-muted-foreground mt-1">
              Create one to organize your content
            </Text>
          </View>
        ) : (
          <FlashList
            data={childGroups}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
