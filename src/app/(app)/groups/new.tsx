import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Switch as SwitchToggle, Select, Card, CardContent, IconPicker } from '@/components/ui';
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

const getGroupIcon = (icon?: string) => {
  if (icon) return icon;
  return 'lucide:folder';
};

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
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top']}>
        <View className="flex-row items-center mb-4">
          <Button variant="ghost" onPress={() => router.back()}>
            ← Back
          </Button>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-6">Create Group</Text>

        <Card>
          <CardContent>
            <Controller
              control={control}
              name="enableGroupshelf"
              render={({ field }) => (
                <View className="rounded-xl border bg-gradient-to-r from-red-500/5 to-pink-500/5 p-4 md:p-6 my-4">
                  <View className="flex-row items-center justify-between gap-4">
                    <View className="flex-1 space-y-1">
                      <Text className="text-base font-semibold text-foreground">
                        Enable Group Shelf
                      </Text>
                      <Text className="text-sm text-muted">
                        Allow this group to be added to groupshelf, so other users can copy it if they find it useful
                      </Text>
                    </View>
                    <SwitchToggle
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </View>
                </View>
              )}
            />

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
                  numberOfLines={4}
                  error={errors.description?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  label="Category"
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
                  label="Icon"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.icon?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="parentId"
              render={({ field }) => {
                const selectedParent = groupsData?.data?.find(
                  (g) => g.id === field.value
                );
                return (
                  <View className='mt-4'>
                    <Text className="text-sm font-medium text-foreground mb-2">
                      Parent Group (Optional)
                    </Text>
                    <View className="flex-row items-center gap-3">
                      {selectedParent ? (
                        <View className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <IconifyIcon name={getGroupIcon(selectedParent.icon)} size={20} />
                        </View>
                      ) : (
                        <View className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <IconifyIcon name="lucide:folder-open" size={20} />
                        </View>
                      )}
                      <Select
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        options={parentOptions}
                        placeholder="None (Top-level)"
                      />
                    </View>
                  </View>
                );
              }}
            />
            <Text className="text-xs text-muted mb-4">
              Create subgroups to organize hierarchically
            </Text>
          </CardContent>
        </Card>

        <View className="flex-row gap-3 mt-6">
          <Button variant="outline" onPress={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={createGroup.isPending}
            className="flex-1"
          >
            Create
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
