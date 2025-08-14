import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, updatePost } from '../api';
import type { Post, PostCreateInput, PostUpdateInput } from '../types';

export function useAddPostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PostCreateInput) => createPost(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueriesData<any>({ queryKey: ['posts'] });

      // 모든 목록 캐시 앞에 낙관적으로 추가
      prev.forEach(([key, data]) => {
        if (!data?.posts) return;
        const tempId = Date.now();
        qc.setQueryData(key, {
          ...data,
          posts: [
            { id: tempId, reactions: { likes: 0, dislikes: 0 }, tags: [], ...input },
            ...data.posts,
          ],
          total: (data.total ?? 0) + 1,
        });
      });

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => {
        if (data) {
          // 롤백
          qc.setQueryData(key, data);
        }
      });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PostUpdateInput) => updatePost(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueriesData<any>({ queryKey: ['posts'] });

      prev.forEach(([key, data]) => {
        if (!data?.posts) return;
        qc.setQueryData(key, {
          ...data,
          posts: data.posts.map((p: Post) => (p.id === input.id ? { ...p, ...input } : p)),
        });
      });

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueriesData<any>({ queryKey: ['posts'] });

      prev.forEach(([key, data]) => {
        if (!data?.posts) return;
        qc.setQueryData(key, {
          ...data,
          posts: data.posts.filter((p: Post) => p.id !== id),
          total: Math.max(0, (data.total ?? 0) - 1),
        });
      });

      return { prev };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
