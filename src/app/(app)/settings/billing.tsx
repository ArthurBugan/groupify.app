import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ListGroup, Button, Text, Separator } from 'heroui-native';
import { useTheme } from '@/theme/ThemeProvider';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { getThemeColor } from '@/theme/themeColors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function BillingScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} className="bg-background">
        <View style={{ paddingTop: insets.top }} className="px-5 pb-6">
          {/* Header */}
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity 
              onPress={() => { Haptics.selectionAsync(); router.back(); }}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: getThemeColor('surface', isDark) }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconifyIcon name="lucide:arrow-left" size={20} color={getThemeColor('foreground', isDark)} />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground">Billing</Text>
            <View className="w-10" />
          </View>

          {/* Current Plan */}
          <View className="bg-surface rounded-2xl p-5 mb-5 border border-border/50">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Current Plan</Text>
              <View className="bg-accent/10 px-3 py-1 rounded-lg">
                <Text className="text-xs font-semibold text-accent">Free</Text>
              </View>
            </View>
            <Text className="text-2xl font-bold text-foreground mb-1">Free Plan</Text>
            <Text className="text-muted text-sm">Basic features included</Text>
          </View>

          {/* Subscription Options */}
          <View className="bg-surface rounded-2xl overflow-hidden mb-5 border border-border/50">
            <View className="px-4 py-3">
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Subscription</Text>
            </View>
            <View>
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:credit-card" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Payment Method</Text>
                  <Text className="text-xs text-muted">No payment method added</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
              <Separator className="mx-4" />
              <TouchableOpacity className="flex-row items-center px-4 py-3.5" activeOpacity={0.7}>
                <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: getThemeColor('default', isDark) }}>
                  <IconifyIcon name="lucide:receipt" size={20} color={getThemeColor('foreground', isDark)} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">Billing History</Text>
                </View>
                <IconifyIcon name="lucide:chevron-right" size={18} color={getThemeColor('muted', isDark)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Manage Subscription */}
          <TouchableOpacity
            className="bg-accent rounded-xl py-3.5 items-center mb-6"
            activeOpacity={0.7}
          >
            <Text className="text-accent-foreground font-semibold text-base">Upgrade Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
