import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupsApi, type CreateGroupRequest, type UpdateGroupRequest, type GroupDisplayOrder } from '@/api/endpoints/groups';
import type { PaginatedResponse } from '@/types';
import type { Group } from '@/types';

export const useGroups = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: () => groupsApi.list(params),
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => groupsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupRequest }) =>
      groupsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['group', id] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groupsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useSyncGroupVideos = () => {
  return useMutation({
    mutationFn: (id: string) => groupsApi.syncVideos(id),
  });
};

export const useBulkUpdateGroupOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groups: GroupDisplayOrder[]) => groupsApi.bulkUpdateDisplayOrder(groups),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

export const useGroupSubgroups = (groupId: string) => {
  return useQuery({
    queryKey: ['groupSubgroups', groupId],
    queryFn: () => groupsApi.getSubgroups(groupId),
    enabled: !!groupId,
  });
};