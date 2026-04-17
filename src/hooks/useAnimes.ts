import { useQuery } from '@tanstack/react-query';
import { animesApi } from '../api/endpoints';
import type { PaginationParams } from '../types';

export const useAnimes = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['animes', params],
    queryFn: () => animesApi.list(params),
  });
};

export const useAnime = (id: string) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => animesApi.get(id),
    enabled: !!id,
  });
};