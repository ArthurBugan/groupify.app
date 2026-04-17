import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/endpoints';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getTotals(),
    staleTime: 1000 * 60,
  });
};