import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Switch as SwitchToggle, Select, Card, CardContent, IconPicker } from '@/components/ui';
import { useGroup, useUpdateGroup, useGroups } from '@/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { UpdateGroupRequest } from '@/api/endpoints/groups';
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

const editGroupSchema = z.object({
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

type EditGroupForm = z.infer<typeof editGroupSchema>;

export default function EditGroupScreen() {
  const router = useRouter();
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data: group, isLoading } = useGroup(id);
  const updateGroup = useUpdateGroup();
  const { data: groupsData } = useGroups({ limit: 100 });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditGroupForm>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
      category: group?.category || '',
      icon: group?.icon || 'twemoji:rocket',
      parentId: group?.parentId || '',
      enableGroupshelf: group?.enableGroupshelf ?? false,
    },
  });

  const parentOptions = [
    { value: '', label: 'None (Top-level)', icon: undefined },
    ...(groupsData?.data?.map((g) => ({
      value: g.id,
      label: g.name,
      icon: g.icon,
    })) ?? []),
  ];

  const onSubmit = async (data: EditGroupForm) => {
    try {
      const payload: UpdateGroupRequest = {
        name: data.name,
        description: data.description,
        category: data.category,
        icon: data.icon,
        parentId: data.parentId || undefined,
        enableGroupshelf: data.enableGroupshelf,
      };
      await updateGroup.mutateAsync({ id, data: payload });
      await AdMobManager.loadRewardedAd();
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update group');
    }
  };

  if (isLoading) {
    return <View className="flex-1 bg-background p-4" />;
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <SafeAreaView edges={['top', 'bottom']}>
        <View className="flex-row items-center mb-4">
          <Button variant="ghost" onPress={() => router.back()}>
            ← Back
          </Button>
        </View>

        <Text className="text-2xl font-bold text-foreground mb-6">Edit Group</Text>

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
                <View className="mb-2">
                  <IconPicker
                    label="Icon"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.icon?.message}
                  />
                </View>
              )}
            />

            <Controller
              control={control}
              name="parentId"
              render={({ field }) => (
                <View className="mt-2">
                  <Select
                    label="Parent Group (Optional)"
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    options={parentOptions}
                    placeholder="None (Top-level)"
                  />
                </View>
              )}
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
            loading={updateGroup.isPending}
            className="flex-1"
          >
            Save
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
