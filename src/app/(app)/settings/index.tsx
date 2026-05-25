import { TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ListGroup, Button, Avatar, Separator, Text, Switch, Chip } from 'heroui-native';
import { useCurrentUser } from '@/hooks';
import { useAuthStore } from '@/stores';
import { useTheme } from '@/theme/ThemeProvider';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { getThemeColor } from '@/theme/themeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { isDark } = useTheme();
  const logout = useAuthStore((s) => s.logout);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    Haptics.selectionAsync();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        <View style={{ paddingTop: insets.top }} className="px-5 pb-6">
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => { Haptics.selectionAsync(); router.back(); }} className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: getThemeColor('surface', isDark) }}>
            <IconifyIcon name="lucide:arrow-left" size={20} color={getThemeColor('foreground', isDark)} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
          <View className="w-10" />
        </View>

        {/* Profile Card */}
        <View className="bg-surface rounded-2xl p-4 mb-5 border border-border/50">
          <View className="flex-row items-center gap-4">
            <Avatar name={user?.name} size="lg" />
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                {user?.name || 'User'}
              </Text>
              <Text className="text-sm text-muted">{user?.email}</Text>
            </View>
            <Button variant="flat" size="sm" onPress={() => { Haptics.selectionAsync(); router.push('/settings/account'); }}>
              <Text className="text-accent font-medium">Edit</Text>
            </Button>
          </View>
        </View>

        {/* Settings Sections */}
        <View className="gap-4 flex-1">
          {/* Account Section */}
          <View className="bg-surface rounded-2xl overflow-hidden border border-border/50">
            <View className="px-4 py-3">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Account</Text>
            </View>
            <View>
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/settings/account'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:user" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Account</Text>
                  <Text className="text-xs text-muted">Profile, password, security</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
              <Separator className="mx-4" />
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/settings/appearance'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:palette" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Appearance</Text>
                  <Text className="text-xs text-muted">Theme, font size, language</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
              <Separator className="mx-4" />
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/settings/billing'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:credit-card" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Billing</Text>
                  <Text className="text-xs text-muted">Subscription, payment methods</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences Section */}
          <View className="bg-surface rounded-2xl overflow-hidden border border-border/50">
            <View className="px-4 py-3">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Preferences</Text>
            </View>
            <View>
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/settings/groups'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:users" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Groups</Text>
                  <Text className="text-xs text-muted">Manage your groups</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
              <Separator className="mx-4" />
              <View className="flex-row items-center px-4 py-3.5">
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:bell" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Notifications</Text>
                  <Text className="text-xs text-muted">Push, email, SMS</Text>
                </View>
                <Switch defaultSelected />
              </View>
              <Separator className="mx-4" />
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/privacy'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:lock" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Privacy</Text>
                  <Text className="text-xs text-muted">Data, sharing, analytics</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Section */}
          <View className="bg-surface rounded-2xl overflow-hidden border border-border/50">
            <View className="px-4 py-3">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Support</Text>
            </View>
            <View>
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/support'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:help-circle" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Help & Support</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
              <Separator className="mx-4" />
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" onPress={() => { Haptics.selectionAsync(); router.push('/terms'); }} activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:file-text" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Terms & Privacy</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mt-auto pt-5">
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 bg-danger/10 border border-danger/20 rounded-xl py-3.5"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <IconifyIcon name="lucide:log-out" size={20} color={getThemeColor('danger', isDark)} />
            <Text className="text-danger font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}
