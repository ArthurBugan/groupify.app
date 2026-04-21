import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDashboard } from '@/hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

      <Text className="text-xl font-semibold text-foreground mt-8 mb-4">Quick Actions</Text>

      <View className="gap-3">
        <TouchableOpacity
          className="bg-primary rounded-xl p-4 flex-row items-center gap-3"
          onPress={() => router.push('/groups/new')}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text className="text-primary-foreground font-medium">Create New Group</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-xl p-4 flex-row items-center gap-3"
          onPress={() => router.push('/channels')}
        >
          <Ionicons name="tv-outline" size={24} color="#fff" />
          <Text className="text-foreground font-medium">Add Channel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-secondary rounded-xl p-4 flex-row items-center gap-3"
          onPress={() => router.push('/animes')}
        >
          <Ionicons name="film-outline" size={24} color="#fff" />
          <Text className="text-foreground font-medium">Add Anime Channel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}