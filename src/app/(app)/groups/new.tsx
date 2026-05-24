import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, IconPicker } from '@/components/ui';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { useCreateGroup, useGroups } from '@/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CreateGroupRequest } from '@/api/endpoints/groups';
import AdMobManager from '@/components/ui/Admob';

const DEFAULT_CATEGORIES = [
  'Apps & Software',
  'Arts',
  'Business',
  'Education',
  'Entertainment',
  'Gaming',
  'Lifestyle',
  'Music',
  'News',
  'Science & Technology',
  'Sports',
  'Travel',
];

const categoryOptions = DEFAULT_CATEGORIES.map((c) => ({ value: c, label: c }));

const createGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Required')
    .max(50, 'Max 50 chars')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Only letters, numbers, spaces, hyphens, underscores',
    ),
  description: z.string().max(200, 'Max 200 chars').optional(),
  category: z.string().min(1, 'Select a category'),
  icon: z.string().min(1, 'Select an icon'),
  parentId: z.string().optional(),
  enableGroupshelf: z.boolean().optional().default(false),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

export default function CreateGroupScreen() {
  const router = useRouter();
  const createGroup = useCreateGroup();
  const { data: groupsData } = useGroups({ limit: 100 });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      icon: 'twemoji:rocket',
      parentId: '',
      enableGroupshelf: false,
    },
  });

  const parentOptions = [
    { value: '', label: 'None (Top-level)', icon: undefined },
    ...(groupsData?.data?.map((g) => ({ value: g.id, label: g.name, icon: g.icon })) ?? []),
  ];

  const onSubmit = async (data: CreateGroupForm) => {
    try {
      const payload: CreateGroupRequest = {
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
        parentId: data.parentId || undefined,
        enableGroupshelf: data.enableGroupshelf,
      };
      await createGroup.mutateAsync(payload);
      await AdMobManager.loadRewardedAd();
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to create group');
    }
  };

  return (
    <View className="flex-1 bg-background px-4">
      <SafeAreaView edges={['top', 'bottom']}>
        <View className="bg-background flex-row items-center justify-between px-4 py-3 border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-accent text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-foreground">Create Group</Text>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={createGroup.isPending}
          >
            <Text className={`text-base font-semibold ${createGroup.isPending ? 'text-muted' : 'text-accent'}`}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="bg-background">
          <Text className="text-xs font-medium text-muted uppercase tracking-widest px-4 pt-6 pb-2">
            Info
          </Text>
          <View className="bg-surface p-4 rounded-xl">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  label="Name"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="My Group"
                  error={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  label="Description"
                  value={field.value ?? ''}
                  onChangeText={field.onChange}
                  placeholder="What's this group about?"
                  multiline
                  numberOfLines={3}
                  error={errors.description?.message}
                />
              )}
            />
          </View>

          <Text className="text-xs font-medium text-muted uppercase tracking-widest px-4 pt-6 pb-2">
            Classification
          </Text>
          <View className="bg-surface p-4 rounded-xl">
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions}
                  placeholder="Select category"
                  error={errors.category?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <IconPicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>

          <Text className="text-xs font-medium text-muted uppercase tracking-widest px-4 pt-6 pb-2">
            Organization
          </Text>
          <View className="bg-surface rounded-xl">
            <Controller
              control={control}
              name="parentId"
              render={({ field }) => {
                return (
                  <View className="px-4 py-3 justify-center">
                    <Text className="text-xs text-muted mb-2">Parent Group</Text>
                    <View className="flex-row items-center align-center gap-3">
                      <View className="flex-1 justify-center">
                        <Select
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          options={parentOptions}
                          placeholder="None (Top-level)"
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <Text className="text-xs text-muted px-4 pt-1 pb-2">
            Create subgroups to organize hierarchically
          </Text>

          <Text className="text-xs font-medium text-muted uppercase tracking-widest px-4 pt-6 pb-2">
            Visibility
          </Text>
          <View className="bg-surface p-4 rounded-xl">
            <Controller
              control={control}
              name="enableGroupshelf"
              render={({ field }) => (
                <View className="px-4 py-3 flex-row items-center justify-between">
                  <View className="flex-1 mr-4">
                    <Text className="text-foreground text-base">Group Shelf</Text>
                    <Text className="text-xs text-muted mt-0.5">
                      Allow others to discover and copy this group
                    </Text>
                  </View>
                  <Switch
                    value={field.value}
                    onValueChange={field.onChange}
                    trackColor={{ false: '#E5E7EB', true: '#39d08a' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              )}
            />
          </View>

          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
