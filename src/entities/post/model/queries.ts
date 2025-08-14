import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchPosts, fetchPostsByTag, fetchTags, searchPosts } from '../api';
import type { PostListResponse, TagItem, PostSearchResponse } from '../types';

export function usePostTagsQuery() {
  return useQuery<TagItem[]>({
    queryKey: ['post', 'tags'],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
  });
}

export function usePostsQuery(params: {
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tag?: string;
  search?: string;
}) {
  const { tag, search, ...listParams } = params;

  return useQuery<PostListResponse | PostSearchResponse>({
    queryKey: ['posts', listParams, { tag, search }],
    queryFn: async () => {
      if (search && search.trim()) return searchPosts(search.trim());
      if (tag && tag !== 'all') return fetchPostsByTag(tag);
      return fetchPosts(listParams);
    },
    placeholderData: keepPreviousData,
  });
}
