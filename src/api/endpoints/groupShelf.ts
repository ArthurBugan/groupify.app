import apiClient from '../client';
import type { GroupShelf, Group } from '../../types';

export interface GroupShelfListResponse {
  data: Group[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const groupShelfApi = {
  list: async (options?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get<GroupShelfListResponse>('/api/v3/groups/shelf', options);
  },

  copy: async (id: string) => {
    return apiClient.post<Group>(`/api/v3/groups/shelf/copy/${id}`, {});
  },
};
