import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBlogPost } from '../../../hooks';
import { Skeleton } from '@/components/ui';

export default function BlogPostScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: blogData, isLoading } = useBlogPost(slug);
  const post = blogData?.data;

  if (isLoading) {
    return (
      <ScrollView className="flex-1 bg-gray-50 p-4">
        <Skeleton height={30} className="mb-4" />
        <Skeleton height={20} className="mb-2" />
        <Skeleton height={20} className="mb-2" />
      </ScrollView>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 bg-gray-50 p-4 items-center justify-center">
        <Text className="text-gray-500">Post not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-2">{post.title}</Text>
      <Text className="text-gray-500 text-sm mb-4">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
      </Text>

      <Text className="text-gray-700 leading-relaxed">{post.content}</Text>
    </ScrollView>
  );
}