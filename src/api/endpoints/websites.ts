import apiClient from '../client';
import type { PaginatedResponse, PaginationParams } from '@/types';
import type { Website } from '@/types';

export const websitesApi = {
  list: async (params?: PaginationParams) => {
    return apiClient.get<PaginatedResponse<Website>>('/api/v3/websites', params);
  },

  delete: async (id: string) => {
    return apiClient.delete<void>(`/api/v3/websites/${id}`);
  },
};