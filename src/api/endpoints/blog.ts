import apiClient from '../client';
import type { BlogPost } from '../../types';

export interface BlogQueryParams {
  status?: string;
  category?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  slug?: string;
  [key: string]: unknown;
}

export const blogApi = {
  list: async (params?: BlogQueryParams) => {
    return apiClient.get<{ data: BlogPost[]; total: number }>('/api/v3/blog', params);
  },

  getBySlug: async (slug: string) => {
    return apiClient.get<BlogPost>(`/api/v3/blog/${slug}`);
  },
};