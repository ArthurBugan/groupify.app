import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCurrentUser } from '../../../hooks';
import { Input, Button, Card, CardContent, Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores';
import { useTheme } from '@/theme/ThemeProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);
  const { isDark } = useTheme();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>

      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-primary">← Back</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-bold text-foreground mb-6">Account</Text>

      <View className="items-center mb-6">
        <Avatar name={user?.name} size="lg" />
        <Button variant="outline" size="sm" className="mt-2">
          Change Photo
        </Button>
      </View>

      <Card>
        <CardContent>
          <Input label="Name" value={name} onChangeText={setName} />
          <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </CardContent>
      </Card>

      <Button onPress={handleSave} fullWidth className="mt-4">
        Save Changes
      </Button>

      <Button variant="danger" onPress={handleLogout} fullWidth className="mt-4">
        Sign Out
      </Button>
      </SafeAreaView>
    </ScrollView>
  );
}