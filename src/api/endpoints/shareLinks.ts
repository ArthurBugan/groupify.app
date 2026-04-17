import apiClient from '../client';
import type { ShareLink, PaginatedResponse } from '../../types';

export interface GenerateShareLinkVariables {
  id: string;
  linkType: string;
  permission: string;
}

export interface GenerateShareLinkResponseData {
  shareLink: string;
}

export interface ConsumedShareLinkResponse {
  groupId: string;
  groupName: string;
  groupDescription: string | null;
  linkType: string;
  permission: string | null;
  channelCount: number;
  channels: import('../../types').Channel[];
}

export const shareLinksApi = {
  list: async () => {
    return apiClient.get<{ data: ShareLink[]; pagination: import('../../types').Pagination }>('/api/v3/share-links');
  },

  create: async (data: GenerateShareLinkVariables) => {
    return apiClient.post<ShareLink>('/api/v3/share-links', data);
  },

  delete: async (id: string) => {
    return apiClient.delete<void>(`/api/v3/share-links/${id}`);
  },

  generate: async (data: GenerateShareLinkVariables) => {
    return apiClient.post<GenerateShareLinkResponseData>('/api/v2/share-link', data);
  },

  getById: async (id: string) => {
    return apiClient.get<ShareLink>(`/api/v2/share-link/${id}`);
  },

  consume: async (linkType: string, linkCode: string) => {
    return apiClient.post<ConsumedShareLinkResponse>(`/api/v2/share-link/${linkType}/${linkCode}`);
  },
};