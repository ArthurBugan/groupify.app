import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { animesApi } from '@/api/endpoints/animes';
import type { PaginatedResponse, Anime } from '@/types';

export function useAnimesInfinite() {
  const [search, setSearch] = useState('');

  const query = useInfiniteQuery<PaginatedResponse<Anime>>({
    queryKey: ['animes', search],
    queryFn: async ({ pageParam = 1 }) => { 
      const result = await animesApi.list({ page: pageParam, limit: 20, search: search || undefined });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialPageParam: 1,
  });

  let animes: Anime[] = [];
  let hasNextPage = false;
  
  if (query.data?.pages) {
    const lastPage = query.data.pages[query.data.pages.length - 1];
    if (lastPage?.pagination) {
      hasNextPage = lastPage.pagination.page < lastPage.pagination.totalPages;
    }
    for (const page of query.data.pages) {
      if (page?.data) {
        animes = [...animes, ...page.data];
      }
    }
  }

  const loadMore = useCallback(async () => {
    if (hasNextPage && !query.isFetching) {
      await query.fetchNextPage();
    }
  }, [hasNextPage, query.fetchNextPage, query.isFetching]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  const handleRefetch = useCallback(() => {
    query.refetch();
  }, [query.refetch]);

  return {
    animes,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetching,
    hasNextPage,
    loadMore,
    search,
    setSearch: handleSearch,
    refetch: handleRefetch,
  };
}