import apiClient from '../client';
import type { PaginatedResponse } from '../../types';
import type { Anime } from '../../types';

export const animesApi = {
  list: async (params?: { page?: number; limit?: number }) => {
    return apiClient.get<PaginatedResponse<Anime>>('/api/v3/animes', params);
  },

  get: async (id: string) => {
    return apiClient.get<Anime>(`/api/v3/animes/${id}`);
  },
};