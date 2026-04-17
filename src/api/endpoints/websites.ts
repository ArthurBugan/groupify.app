import apiClient from '../client';
import type { PaginatedResponse, PaginationParams } from '@/types';
import type { Website } from '@/types';

export const websitesApi = {
  list: async (params?: PaginationParams) => {
    return apiClient.get<PaginatedResponse<Website>>('/api/v2/websites', params);
  },

  delete: async (id: string) => {
    return apiClient.delete<void>(`/api/v2/websites/${id}`);
  },
};