import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shareLinksApi, type GenerateShareLinkVariables } from '../api/endpoints/shareLinks';

export const useShareLinks = () => {
  return useQuery({
    queryKey: ['shareLinks'],
    queryFn: () => shareLinksApi.list(),
  });
};

export const useCreateShareLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateShareLinkVariables) => shareLinksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shareLinks'] });
    },
  });
};

export const useDeleteShareLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shareLinksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shareLinks'] });
    },
  });
};