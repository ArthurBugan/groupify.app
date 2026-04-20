import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useGroup, useChannels } from '../../../../hooks';
import { Card, CardContent, Checkbox, Button, Input } from '@/components/ui';
import DashboardHeader from '@/components/DashboardHeader';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddChannelToGroupScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: group } = useGroup(id);
  const { data: channelsData } = useChannels();
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const { isDark } = useTheme();

  const toggleChannel = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((c) => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleSave = () => {
    Alert.alert('Success', 'Channels added to group');
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-blue-500">← Back</Text>
        </TouchableOpacity>
      </View>

      <DashboardHeader
        title="Add Channels"
        description={`Add channels to ${group?.name}`}
      />

      <Input value="" onChangeText={() => {}} placeholder="Search channels..." className="mb-4" />

      <Text className="text-lg font-semibold mb-3">Available Channels</Text>

      {channelsData?.map((channel) => (
        <TouchableOpacity
          key={channel.id}
          onPress={() => toggleChannel(channel.id)}
        >
          <Card className="mb-2">
            <CardContent className="flex-row items-center">
              <Checkbox
                checked={selectedChannels.includes(channel.id)}
                onChange={() => toggleChannel(channel.id)}
              />
              <View className="ml-3">
                <Text className="font-medium">{channel.name}</Text>
                <Text className="text-muted-foreground text-sm">{channel.url}</Text>
              </View>
            </CardContent>
          </Card>
        </TouchableOpacity>
      ))}

      <Button onPress={handleSave} fullWidth className="mt-4">
        Add Selected ({selectedChannels.length})
      </Button>
      </SafeAreaView>
    </ScrollView>
  );
}