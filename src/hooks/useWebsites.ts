import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { websitesApi } from '../api/endpoints';
import type { PaginationParams } from '../types';

export const useWebsites = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['websites', params],
    queryFn: () => websitesApi.list(params),
  });
};

export const useDeleteWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => websitesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['websites'] });
    },
  });
};