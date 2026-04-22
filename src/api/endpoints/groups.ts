import apiClient from '../client';
import type { PaginatedResponse, Pagination } from '../../types';
import type { Group, Channel, Anime, Website } from '../../types';

export interface CreateGroupRequest {
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  parentId?: string | null;
  enableGroupshelf?: boolean;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
  parentId?: string | null;
  enableGroupshelf?: boolean;
}

export interface GroupDisplayOrder {
  id: string;
  displayOrder: number;
}

export const groupsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get<PaginatedResponse<Group>>('/api/v3/groups', params);
  },

  get: async (id: string) => {
    const response = await apiClient.get<{ data: Group }>(`/api/v2/groups/${id}`);
    return response?.data as Group;
  },

  create: async (data: CreateGroupRequest) => {
    return apiClient.post<Group>('/api/v2/groups', data);
  },

  update: async (id: string, data: UpdateGroupRequest) => {
    return apiClient.put<Group>(`/api/v2/groups/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<void>(`/api/v2/groups/${id}`);
  },

  updateDisplayOrder: async (id: string, displayOrder: number) => {
    return apiClient.put<Group>(`/api/v2/groups/${id}/display-order`, { displayOrder });
  },

  bulkUpdateDisplayOrder: async (groups: GroupDisplayOrder[]) => {
    return apiClient.put<void>('/api/v2/groups/display-order/bulk', { groups });
  },

  syncVideos: async (id: string) => {
    return apiClient.post<{ synced: number }>(`/api/v3/groups/${id}/videos/sync`);
  },

  getSubgroups: async (groupId: string) => {
    return apiClient.get<Group[]>(`/api/v3/groups/subgroups/${groupId}`);
  },
};