import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useGroup, useGroupSubgroups } from '@/hooks';
import { Card, CardContent, Button } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

export default function GroupOverviewScreen() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { data: subgroupsData } = useGroupSubgroups(id);


  const getGroupIcon = (icon?: string) => {
    if (icon) return icon;
    return 'lucide:folder';
  };

    if (!group) {
      return (
        <View className="flex-1 bg-background items-center justify-center">
          <Text className="text-muted-foreground">Loading...</Text>
        </View>
      );
    }

    const handleItemPress = (item: any) => {
      // Check if it's a channel or website with a URL
      if (item.url) {
        const url = item.url;
        // Check if it's a YouTube link or a plain YouTube channel ID
        if (/^[UC][a-zA-Z0-9_-]{22,}$/.test(url)) {
          let youtubeId = '';
          try {
            // Handle both full URLs and channel ID strings safely
            if (url.startsWith('http')) {
              const parsedUrl = new URL(url);
              youtubeId = parsedUrl.searchParams.get('v');
            } else {
              youtubeId = `youtube://watch?v=${url}`;
            }
          } catch (e) {
            console.error('Invalid YouTube URL:', url, e);
          }
          const isChannelId = !url.startsWith('http');
          const youtubeScheme = youtubeId ? `youtube://watch?v=${youtubeId}` : url;
          Linking.canOpenURL(youtubeScheme)
            .then((supported) => {
              if (supported) {
                Linking.openURL(youtubeScheme).catch((e) => {
                  console.error("YouTube deep link failed, opening in browser:", e);
                  Linking.openURL(isChannelId ? `https://www.youtube.com/channel/${url}` : url);
                });
              } else {
                console.log("YouTube app not installed, opening in browser");
                Linking.openURL(url);
              }
            })
            .catch(() => {
              // If url is a channel ID, convert to YouTube homepage URL
              const fallbackUrl = isChannelId ? `https://www.youtube.com/channel/${url}` : url;
              Linking.openURL(fallbackUrl);
            });
        }
        // Check if it's an anime-related link
        else if (url.includes('anime') || item.contentType === 'anime') {
          // Try crunchyroll:// scheme first
          Linking.canOpenURL('crunchyroll://')
            .then((supported) => {
              if (supported) {
                Linking.openURL('crunchyroll://').catch(() => {
                  Linking.openURL(url);
                });
              } else {
                Linking.openURL(url);
              }
            })
            .catch((error) => {
              console.error('Crunchyroll link check failed:', error);
              console.log("Falling back to browser for:", url);
              Linking.openURL(url);
            });
        }
        // Default: open in browser
        else {
          Linking.openURL(url).catch((error) => {
            console.error('Failed to open URL:', error);
          });
        }
        return;
      }

      // Handle subgroup navigation
      if (item.id) {
        router.push(`/groups/${item.id}`);
      }
    };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-2">
            <Text className="text-primary">← Back</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-16 h-16 rounded-xl bg-card items-center justify-center">
            <IconifyIcon name={getGroupIcon(group.icon)} size={32} />
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">{group.name}</Text>
            {group.category && (
              <Text className="text-muted-foreground">{group.category}</Text>
            )}
          </View>
        </View>
        <View className='my-2'>
          <Button
            onPress={() => router.push(`/groups/${id}/add-channel`)}
            variant="secondary"
          >
            <View className='flex-row justify-center items-center gap-2'>
              <IconifyIcon name="lucide:plus" size={20} />
              <Text className="text-md mt-1 font-bold text-foreground">Add Channel</Text>
            </View>
          </Button>
        </View>

        <Card>
          <CardContent className="bg-card rounded-xl">
            {group.description ? (
              <Text className="text-muted-foreground">{group.description}</Text>
            ) : (
              <Text className="text-muted-foreground">No description</Text>
            )}
          </CardContent>
        </Card>

        {subgroupsData && subgroupsData.length > 0 && (
          <View className="mt-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Subgroups ({subgroupsData.length})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {subgroupsData.map((childGroup) => (
                <TouchableOpacity
                  key={childGroup.id}
                  className="w-20 items-center gap-2 bg-card p-1.5 rounded-lg mx-1"
                  onPress={() => handleItemPress(childGroup)}
                >
                  <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
                    <IconifyIcon name={getGroupIcon(childGroup.icon)} size={16} />
                  </View>
                  <Text className="text-xs text-foreground text-center" numberOfLines={2}>
                    {childGroup.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {group.channels && group.channels.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Channels ({group.channels.length})
            </Text>
            <View className="gap-2">
              {group.channels.map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  className="flex-row items-center gap-3 bg-card p-1.5 rounded-lg"
                  onPress={() => handleItemPress(channel)}
                >
                  {channel.thumbnail || channel.imageUrl ? (
                    <Image
                      source={{ uri: channel.thumbnail || channel.imageUrl }}
                      className="w-10 h-10 rounded-lg"
                    />
                  ) : (
                    <View className="w-10 h-10 rounded-lg bg-secondary items-center justify-center">
                      <IconifyIcon name="mdi:television-play" size={20} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-foreground font-medium">{channel.name}</Text>
                  </View>
                  <View className="w-6 h-6 rounded-lg bg-secondary items-center justify-center">
                    <IconifyIcon name="mdi:open-in-new" size={14} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}


      </SafeAreaView>
    </ScrollView>
  );
}