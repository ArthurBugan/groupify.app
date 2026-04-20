import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DashboardHomeScreen() {
  const router = useRouter();
  const { data: dashboard, isLoading } = useDashboard();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingLeft: insets.left,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
      }}
      className="flex-1 bg-background p-4"
      >
      <Text className="text-3xl font-bold text-foreground mb-6">Dashboard</Text>

      <View className="flex-row flex-wrap gap-3">
        <TouchableOpacity
          className="w-[47%] bg-card rounded-xl p-5 items-center"
          onPress={() => router.push('/groups')}
        >
          <Text className="text-3xl font-bold text-primary">{isLoading ? '-' : dashboard?.groups || 0}</Text>
          <Text className="text-sm text-muted-foreground mt-1">Groups</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-card rounded-xl p-5 items-center"
          onPress={() => router.push('/channels')}
        >
          <Text className="text-3xl font-bold text-primary">{isLoading ? '-' : dashboard?.channels || 0}</Text>
          <Text className="text-sm text-muted-foreground mt-1">Channels</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-card rounded-xl p-5 items-center"
          onPress={() => router.push('/animes')}
        >
          <Text className="text-3xl font-bold text-primary">{isLoading ? '-' : dashboard?.animeChannels || 0}</Text>
          <Text className="text-sm text-muted-foreground mt-1">Animes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-[47%] bg-card rounded-xl p-5 items-center"
          onPress={() => router.push('/websites')}
        >
          <Text className="text-3xl font-bold text-primary">{isLoading ? '-' : dashboard?.websites || 0}</Text>
          <Text className="text-sm text-muted-foreground mt-1">Websites</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}