import apiClient from '../client';
import type { GroupShelf } from '../../types';

export interface UpdateGroupShelfRequest {
  groupIds: string[];
}

export const groupShelfApi = {
  get: async () => {
    return apiClient.get<GroupShelf>('/groupshelf');
  },

  update: async (data: UpdateGroupShelfRequest) => {
    return apiClient.post<GroupShelf>('/groupshelf', data);
  },
};