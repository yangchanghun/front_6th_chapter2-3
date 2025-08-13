import { useQuery } from '@tanstack/react-query';
import { getPostTags, getPostsWithAuthors, getPostsByTagWithAuthors, searchPosts } from './api';
import type { PostListResponse } from './types';

/**
 * 게시물 목록(검색/태그/기본)을 하나의 훅으로
 * - queryKey로 결과를 분리해 캐시 관리
 */
export function usePosts(params: { skip: number; limit: number; q?: string; tag?: string }) {
  const { skip, limit, q, tag } = params;

  const enabled = true;
  if (q && q.trim()) {
    return useQuery({
      queryKey: ['posts', 'search', { q, skip, limit }],
      queryFn: () => searchPosts(q),
      select: (data: PostListResponse) => ({ posts: data.posts, total: data.total }),
      enabled,
    });
  }

  if (tag && tag !== 'all') {
    return useQuery({
      queryKey: ['posts', 'tag', { tag, skip, limit }],
      queryFn: () => getPostsByTagWithAuthors(tag),
      select: (data: { posts: any[]; total: number }) => data,
      enabled,
    });
  }

  return useQuery({
    queryKey: ['posts', 'list', { skip, limit }],
    queryFn: () => getPostsWithAuthors({ skip, limit }),
    select: (data: { posts: any[]; total: number }) => data,
    enabled,
  });
}

/**
 * 태그 목록
 */
export function usePostTags() {
  return useQuery({
    queryKey: ['posts', 'tags'],
    queryFn: getPostTags,
  });
}
