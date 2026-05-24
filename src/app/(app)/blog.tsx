import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useBlogInfinite } from '@/hooks';
import { Card, CardContent, Skeleton } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import type { BlogPost } from '@/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlogListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    search,
    setSearch,
    filters,
    setFilters,
  } = useBlogInfinite({ limit: 10 });

  const activeCategory = filters.category ?? '';

  const renderPost = ({ item: post }: { item: BlogPost }) => (
    <TouchableOpacity
      key={post.id}
      onPress={() => router.push(`/blog/${post.slug}`)}
    >
      <Card className="mb-3">
        <CardContent>
          <Text className="text-lg text-foreground font-semibold">{post.title}</Text>
          {post.excerpt && (
            <Text className="text-muted mt-1" numberOfLines={2}>
              {post.excerpt}
            </Text>
          )}
          <Text className="text-muted text-sm mt-2">
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" />
        </View>
      );
    }
    if (!hasNextPage && posts.length > 0) {
      return (
        <View className="py-4 items-center">
          <Text className="text-muted text-sm">All posts loaded</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-background"
    >
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>
        <DashboardHeader title="Blog" />

        <View className="mt-3 mb-3">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search posts..."
            placeholderTextColor="#9CA3AF"
            className="bg-default border border-border rounded-lg px-4 py-2.5 text-foreground"
          />
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPost}
        className="flex-1 px-4"
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View className="gap-2 p-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent>
                    <Skeleton height={22} className="mb-2" />
                    <Skeleton height={16} className="mb-1" />
                    <Skeleton height={14} className="mt-2 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </View>
          ) : (
            <View className="p-8 items-center">
              <Text className="text-muted">No posts yet</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}
