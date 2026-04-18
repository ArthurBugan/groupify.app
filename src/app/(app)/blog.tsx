import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useBlogPosts } from '@/hooks';
import { Card, CardContent } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import type { BlogPost } from '@/types';
import { useTheme } from '@/theme/ThemeProvider';

export default function BlogListScreen() {
  const router = useRouter();
  const { data } = useBlogPosts();
  const posts = data?.data || [];
  const { isDark } = useTheme();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <DashboardHeader title="Blog" />

      {posts.length === 0 ? (
        <Text className="text-muted-foreground text-center mt-8">No posts yet</Text>
      ) : (
        posts.map((post: BlogPost) => (
          <TouchableOpacity
            key={post.id}
            onPress={() => router.push(`/blog/${post.slug}`)}
          >
            <Card className="mb-3">
              <CardContent>
                <Text className="text-lg font-semibold">{post.title}</Text>
                {post.excerpt && (
                  <Text className="text-muted-foreground mt-1" numberOfLines={2}>
                    {post.excerpt}
                  </Text>
                )}
                <Text className="text-muted-foreground text-sm mt-2">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
                </Text>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}