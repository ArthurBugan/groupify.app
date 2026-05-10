import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupShelfApi } from '@/api/endpoints/groupShelf';
import type { UpdateGroupShelfRequest } from '@/api/endpoints/groupShelf';
import { toast } from 'sonner-native';

export const useGroupShelf = () => {
  return useQuery({
    queryKey: ['groupShelf'],
    queryFn: () => groupShelfApi.get(),
  });
};

export const useGroupShelves = (options: { page?: number; limit?: number; search?: string } = {}) => {
  return useQuery({
    queryKey: ['groupShelves', options],
    queryFn: () => groupShelfApi.list(options),
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
  });
};

export const useUpdateGroupShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGroupShelfRequest) => groupShelfApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupShelf'] });
    },
  });
};

export const useCopyShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shelfId: string) => groupShelfApi.copy(shelfId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupShelves'] });
      toast.success('Group shelf copied', {
        description: 'The group shelf has been copied successfully.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to copy group shelf', {
        description: error.message || 'Please try again later.',
      });
    },
  });
};
