import apiClient from '../client';
import type { PaginatedResponse, Pagination } from '../../types';
import type { Channel } from '../../types';

export interface CreateChannelRequest {
  name: string;
  channelId: string;
  url: string;
  thumbnail?: string;
  subscriberCount?: number;
  videoCount?: number;
  groupId: string;
}

export interface UpdateChannelRequest {
  id: string;
  contentType?: string;
  name?: string;
  channelId?: string;
  url?: string;
  thumbnail?: string;
  subscriberCount?: number;
  videoCount?: number;
  groupId?: string;
}

export interface BatchUpdateChannelRequest {
  channels: UpdateChannelRequest[];
}

export const channelsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    return apiClient.get<PaginatedResponse<Channel>>('/api/v2/channels', params);
  },

  get: async (id: string) => {
    return apiClient.get<Channel>(`/api/v2/channels/${id}`);
  },

  getByGroup: async (groupId: string) => {
    return apiClient.get<PaginatedResponse<Channel>>(`/api/v2/channels/group/${groupId}`);
  },

  create: async (data: CreateChannelRequest) => {
    return apiClient.post<Channel>('/api/v2/channels', data);
  },

  update: async (id: string, data: UpdateChannelRequest) => {
    return apiClient.patch<Channel>(`/api/v2/channels/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete<void>(`/api/v2/channels/${id}`);
  },

  batchUpdate: async (groupId: string, data: BatchUpdateChannelRequest) => {
    return apiClient.post<void>(`/api/v3/channels/${groupId}/batch`, data);
  },
};