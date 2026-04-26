import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { groupsApi } from '@/api/endpoints/groups';
import type { PaginatedResponse, Group } from '@/types';

export function useGroupsInfinite(options: { page?: number, search?: string, limit?: number }) {
  const [search, setSearch] = useState(options.search || '');

  const query = useInfiniteQuery<PaginatedResponse<Group>>({
    queryKey: ['groups', search],
    queryFn: async ({ pageParam = 1 }) => { 
      const result = await groupsApi.list({ page: options.page || pageParam, limit: options.limit || 20, search: options.search || undefined });
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

  let groups: Group[] = [];
  let hasNextPage = false;
  
  if (query.data?.pages) {
    const lastPage = query.data.pages[query.data.pages.length - 1];
    if (lastPage?.pagination) {
      hasNextPage = lastPage.pagination.page < lastPage.pagination.totalPages;
    }
    for (const page of query.data.pages) {
      if (page?.data) {
        groups = [...groups, ...page.data];
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
    groups,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetching,
    hasNextPage,
    loadMore,
    search,
    setSearch: handleSearch,
    refetch: handleRefetch,
  };
}
