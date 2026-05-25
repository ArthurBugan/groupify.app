import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useGroupsInfinite } from '@/hooks/useGroupsInfinite';
import { useTheme } from '@/theme/ThemeProvider';
import type { Group } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { useState, useMemo, useCallback } from 'react';
import { InlineAd } from '@/components/ui/Admob';
import { Skeleton } from '@/components/ui';
import { getThemeColor } from '@/theme/themeColors';
import * as Haptics from 'expo-haptics';
import DashboardHeader from '@/components/DashboardHeader';
import { FlashList } from '@shopify/flash-list';

interface GroupWithChildren extends Group {
  children?: GroupWithChildren[];
}

type ListItem = GroupWithChildren | { isAd: true; id: string };

export default function GroupsListScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    groups,
    isLoading,
    isFetchingNextPage,
    loadMore,
    search,
    setSearch,
    refetch,
    setIsActive,
  } = useGroupsInfinite({
    limit: 30,
  });

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => setIsActive(false);
    }, [setIsActive])
  );

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    Haptics.selectionAsync();
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

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

    // Inject ads every 5 items
    const result: ListItem[] = [];
    rootGroups.forEach((group, index) => {
      result.push(group);
      if ((index + 1) % 5 === 0) {
        result.push({ isAd: true, id: `ad-${index}` });
      }
    });

    return result;
  }, [groups]);

  const toggleExpand = (groupId: string) => {
    Haptics.selectionAsync();
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
          className="bg-surface rounded-xl p-3.5 mb-2 flex-row items-center gap-3"
          style={{ marginLeft: level * 16 }}
          onPress={() => { Haptics.selectionAsync(); router.push(`/groups/${group.id}`); }}
          activeOpacity={0.7}
        >
          <View className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: getThemeColor('default', isDark) }}>
            <IconifyIcon name={getGroupIcon(group.icon)} size={20} color={getThemeColor('foreground', isDark)} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>{group.name}</Text>
            {group.description && (
              <Text className="text-xs text-muted mt-0.5" numberOfLines={1}>
                {group.description}
              </Text>
            )}
          </View>
          {hasChildren && (
            <TouchableOpacity onPress={() => toggleExpand(group.id)} className="w-8 h-8 rounded-lg bg-default items-center justify-center">
              <IconifyIcon
                name={isExpanded ? 'lucide:folder-open' : 'lucide:folder'}
                size={isExpanded ? 18 : 18}
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
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={getThemeColor('accent', isDark)} />
      </View>
    );
  };

  const renderSkeleton = () => (
    <View className="gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <View key={i} className="bg-surface rounded-xl p-3.5 flex-row items-center gap-3">
          <Skeleton width={40} height={40} className="rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton height={16} className="w-3/4 rounded-lg" />
            <Skeleton height={12} className="w-1/2 rounded-lg" />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor={getThemeColor('accent', isDark)}
            colors={[getThemeColor('accent', isDark)]}
          />
        }
      >
        <View style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>
          <View className="pt-4 pb-2">
            <DashboardHeader 
              title="Groups" 
              action={{
                label: '+ New',
                onPress: () => { Haptics.selectionAsync(); router.push('/groups/new'); }
              }}
            />
          </View>
          
          <View className="mb-4">
            <TextInput
              placeholder="Search groups..."
              placeholderTextColor={getThemeColor('field-placeholder', isDark)}
              value={search}
              onChangeText={setSearch}
              className="rounded-xl"
            />
          </View>
          
          <FlashList
            data={groupedGroups}
            renderItem={({ item }) => {
              if ('isAd' in item) {
                return <InlineAd />;
              }
              return renderGroup(item);
            }}
            keyExtractor={(item, index) => item.id + index}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListEmptyComponent={
              isLoading ? (
                renderSkeleton()
              ) : (
                <View className="py-16 items-center">
                  <View className="w-16 h-16 rounded-2xl items-center justify-center mb-4" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                    <IconifyIcon name="lucide:folder-open" size={32} color={getThemeColor('muted', isDark)} />
                  </View>
                  <Text className="text-muted text-center font-medium">No groups yet</Text>
                  <Text className="text-muted text-xs text-center mt-1">Create one to get started!</Text>
                </View>
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
