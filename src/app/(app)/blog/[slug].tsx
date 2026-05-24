import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBlogPost } from '@/hooks';
import { Skeleton } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';
import { Linking } from 'react-native';
import { InlineAd } from '@/components/ui/Admob';

const AD_RE = /<ins\s+class=["']adsbygoogle["']\s*>\s*<\/ins>\s*/gi;

export default function BlogPostScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: blogData, isLoading } = useBlogPost(slug);
  const { isDark } = useTheme();
  const post = blogData;

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

  const segments = post.content.split(AD_RE);

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top', 'bottom']}>

        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-accent">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-2">{post.title}</Text>
        <Text className="text-muted text-sm mb-4">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
        </Text>

        {segments.map((segment, index) => (
          <View key={index}>
            {segment.trim() && (
              <EnrichedMarkdownText
                markdown={segment}
                onLinkPress={({ url }) => Linking.openURL(url)}
                markdownStyle={{
                  paragraph: { color: getThemeColor('foreground', isDark) },
                  h1: { color: getThemeColor('foreground', isDark) },
                  h2: { color: getThemeColor('foreground', isDark) },
                  h3: { color: getThemeColor('foreground', isDark) },
                  link: { color: getThemeColor('accent', isDark) },
                  strong: { color: getThemeColor('foreground', isDark) },
                  em: { color: getThemeColor('foreground', isDark) },
                  code: { color: getThemeColor('foreground', isDark), backgroundColor: getThemeColor('default', isDark) },
                  codeBlock: { color: getThemeColor('foreground', isDark), backgroundColor: getThemeColor('default', isDark) },
                  blockquote: { color: getThemeColor('muted', isDark), borderColor: getThemeColor('accent', isDark) },
                }}
              />
            )}
            {index < segments.length - 1 && <InlineAd />}
          </View>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}
