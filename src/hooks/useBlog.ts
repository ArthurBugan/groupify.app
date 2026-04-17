import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../api/endpoints';

export const useBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogApi.list(),
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => blogApi.getBySlug(slug),
    enabled: !!slug,
  });
};