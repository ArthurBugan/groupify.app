import apiClient from '../client';
import type { DashboardTotals } from '../../types';

export const dashboardApi = {
  getTotals: async () => {
    const {data} = await apiClient.get<{data: DashboardTotals}>('/api/v2/dashboard/total');
    return data;
  },
};