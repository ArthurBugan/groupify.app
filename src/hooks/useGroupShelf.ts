import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { groupShelfApi } from '../api/endpoints';
import type { UpdateGroupShelfRequest } from '../api/endpoints/groupShelf';

export const useGroupShelf = () => {
  return useQuery({
    queryKey: ['groupShelf'],
    queryFn: () => groupShelfApi.get(),
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