import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBlogPost } from '../../../hooks';
import { Skeleton } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

export default function BlogPostScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: blogData, isLoading } = useBlogPost(slug);
  const post = blogData?.data;
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-background p-4">
        <Skeleton height={30} className="mb-4" />
        <Skeleton height={20} className="mb-2" />
        <Skeleton height={20} className="mb-2" />
      </ScrollView>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 bg-background p-4 items-center justify-center">
        <Text className="text-muted">Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-accent">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-2">{post.title}</Text>
      <Text className="text-muted text-sm mb-4">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
      </Text>

      <Text className="text-foreground leading-relaxed">{post.content}</Text>
    </ScrollView>
  );
}