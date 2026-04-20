import apiClient from '../client';
import type { DashboardTotals } from '../../types';

export const dashboardApi = {
  getTotals: async () => {
    return apiClient.get<DashboardTotals>('/api/v2/dashboard/total');
  },
};