import { useState, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { channelsApi } from '@/api/endpoints/channels';
import type { PaginatedResponse, Channel } from '@/types';

export function useChannelsInfinite({ limit = 20, page, search }: { limit?: number; page?: number; search?: string } = {}) {
  const [searchText, setSearchText] = useState(search ?? '');

  const query = useInfiniteQuery<PaginatedResponse<Channel>>({
    queryKey: ['channels', searchText],
    queryFn: ({ pageParam = 1 }) => channelsApi.list({ page: page ?? pageParam, limit, search: searchText }),
    getNextPageParam: (lastPage) => lastPage?.pagination && lastPage.pagination.page < lastPage.pagination.totalPages 
      ? lastPage.pagination.page + 1 
      : undefined,
    initialPageParam: 1,
  });

  return {
    channels: query.data?.pages.flatMap(page => page?.data ?? []) ?? [],
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    loadMore: query.fetchNextPage,
    search: searchText,
    setSearch: setSearchText,
    refetch: query.refetch,
  };
}
