import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconifyIcon } from '@huymobile/react-native-iconify';

const shortcuts = [
  { label: 'Groups', count: 'groups', route: '/groups', icon: 'lucide:folder', gradient: 'from-rose-400/80 to-pink-500/80' },
  { label: 'Channels', count: 'channels', route: '/channels', icon: 'lucide:tv', gradient: 'from-violet-400/80 to-purple-500/80' },
  { label: 'Animes', count: 'animeChannels', route: '/animes', icon: 'lucide:film', gradient: 'from-amber-400/80 to-orange-500/80' },
  { label: 'Websites', count: 'websites', route: '/websites', icon: 'lucide:globe', gradient: 'from-emerald-400/80 to-teal-500/80' },
  { label: 'Group Shelf', count: null, route: '/groupshelf', icon: 'lucide:shelf', gradient: 'from-sky-400/80 to-cyan-500/80' },
  { label: 'Share Links', count: null, route: '/share-links', icon: 'lucide:link-2', gradient: 'from-indigo-400/80 to-blue-500/80' },
];

const actions = [
  { label: 'New Group', route: '/groups/new', icon: 'lucide:plus-circle' },
  { label: 'Add Channel', route: '/channels', icon: 'lucide:tv-minimal-play' },
  { label: 'Add Anime', route: '/animes', icon: 'lucide:clapperboard' },
  { label: 'Settings', route: '/settings', icon: 'lucide:settings' },
  { label: 'Blog', route: '/blog', icon: 'lucide:newspaper' },
];

export default function DashboardHomeScreen() {
  const router = useRouter();
  const { data: dashboard, isLoading } = useDashboard();
  const insets = useSafeAreaInsets();

  const getCount = (key: string | null) => {
    if (!key) return '';
    if (isLoading) return '—';
    return dashboard?.[key as keyof typeof dashboard] ?? 0;
  };

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: insets.bottom,
      }}
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <View className="px-4 pt-2 pb-6">
        <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
        <Text className="text-sm text-muted-foreground mt-1">Your content at a glance</Text>
      </View>

      {/* Shortcut cards */}
      <View className="px-4 pb-6">
        <View className="flex-row flex-wrap justify-between">
          {shortcuts.map((s) => (
            <TouchableOpacity
              key={s.label}
              className={`w-[48%] rounded-2xl p-4 bg-gradient-to-br ${s.gradient} mb-3`}
              onPress={() => router.push(s.route)}
            >
              <IconifyIcon name={s.icon} size={22} color="rgba(255,255,255,0.85)" />
              {s.count ? (
                <>
                  <Text className="text-2xl font-bold text-white mt-3">{getCount(s.count)}</Text>
                  <Text className="text-sm text-white/70 mt-0.5">{s.label}</Text>
                </>
              ) : (
                <Text className="text-base font-semibold text-white mt-3">{s.label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick actions */}
      <View className="px-4">
        <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {actions.map((a) => (
            <TouchableOpacity
              key={a.label}
              className="flex-row items-center gap-2 bg-secondary border border-input rounded-xl px-4 py-3"
              onPress={() => router.push(a.route)}
            >
              <IconifyIcon name={a.icon} size={18} className="text-primary" />
              <Text className="text-sm font-semibold text-foreground">{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
