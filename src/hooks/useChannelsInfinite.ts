import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { channelsApi } from '@/api/endpoints/channels';
import type { PaginatedResponse, Channel } from '@/types';

export function useChannelsInfinite({ limit, page, search }: { limit: number; page: number; search: string }) {
  const query = useInfiniteQuery<PaginatedResponse<Channel>>({
    queryKey: ['channels', search],
    queryFn: async ({ pageParam = 1 }) => await channelsApi.list({ page: pageParam, limit, search: search || undefined }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
  });

  let channels: Channel[] = [];
  let hasNextPage = false;
  

  if (query.data?.pages) {
    const lastPage = query.data.pages[query.data.pages.length - 1];
    if (lastPage?.pagination) {
      hasNextPage = lastPage.pagination.page < lastPage.pagination.totalPages;
    }
    for (const page of query.data.pages) {
      if (page?.data) {
        channels = [...channels, ...page.data];
      }
    }
  }

  const loadMore = useCallback(async () => {
    if (hasNextPage && !query.isFetching) {
      await query.fetchNextPage();
    }
  }, [hasNextPage, query.fetchNextPage, query.isFetching]);

  const handleRefetch = useCallback(() => {
    query.refetch();
  }, [query.refetch]);

  return {
    channels,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetching,
    hasNextPage,
    loadMore,
    refetch: handleRefetch,
  };
}