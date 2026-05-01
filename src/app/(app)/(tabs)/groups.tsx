import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGroupsInfinite } from '@/hooks/useGroupsInfinite';
import { useTheme } from '@/theme/ThemeProvider';
import type { Group } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';
import { useState, useMemo } from 'react';

interface GroupWithChildren extends Group {
  children?: GroupWithChildren[];
}

export default function GroupsListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    groups,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    search,
    setSearch,
    refetch,
  } = useGroupsInfinite({
    page: 1,
    limit: 30,
  });

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

  const groupedGroups = useMemo(() => {
    const groupMap = new Map<string, GroupWithChildren>();
    const rootGroups: GroupWithChildren[] = [];

    groups.forEach(group => {
      groupMap.set(group.id, { ...group, children: [] });
    });

    groups.forEach(group => {
      const groupWithChildren = groupMap.get(group.id)!;
      if (group.parentId && groupMap.has(group.parentId)) {
        groupMap.get(group.parentId)!.children!.push(groupWithChildren);
      } else {
        rootGroups.push(groupWithChildren);
      }
    });

    return rootGroups;
  }, [groups]);

  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const renderGroup = (group: GroupWithChildren, level: number = 0) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = expandedGroups.has(group.id);

    return (
      <View key={group.id}>
        <TouchableOpacity
          className="bg-card rounded-xl p-1.5 mb-2 flex-row items-center gap-3"
          style={{ marginLeft: level * 20 }}
          onPress={() => router.push(`/groups/${group.id}`)}
        >
          <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
            <IconifyIcon name={getGroupIcon(group.icon)} size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground">{group.name}</Text>
            {group.description && (
              <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                {group.description}
              </Text>
            )}
          </View>
          {hasChildren && (
            <TouchableOpacity onPress={() => toggleExpand(group.id)} className="w-6 h-6 rounded-lg bg-secondary items-center justify-center">
              <IconifyIcon
                name={isExpanded ? 'lucide:folder-open' : 'lucide:folder'}
                size={isExpanded ? 14 : 14}
                color={isDark ? '#94a3b8' : '#9CA3AF'}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        {hasChildren && isExpanded && group.children!.map(child => renderGroup(child, level + 1))}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-background"
    >
      <View>
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-3xl font-bold text-foreground pl-4">Groups</Text>
          <TouchableOpacity
            className="bg-primary px-4 py-2 mr-2 rounded-lg"
            onPress={() => router.push('/groups/new')}
          >
            <Text className="text-primary-foreground font-semibold">+ New</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mb-4 p-4">
        <TextInput
          className="bg-card rounded-xl p-3 text-foreground"
          placeholder="Search groups..."
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={refetch}
        />
      </View>
      <FlatList
        data={groupedGroups}
        renderItem={({ item }) => renderGroup(item)}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={
          <Text className="text-center text-muted-foreground mt-10">
            {isLoading ? 'Loading...' : 'No groups yet. Create one to get started!'}
          </Text>
        }
      />
    </View>
  );
}
