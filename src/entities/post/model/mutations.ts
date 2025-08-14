import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, deletePost, updatePost } from '../api';
import type { Post, PostCreateInput, PostUpdateInput } from '../types';
import { MOCK_MODE } from '../../../shared/config';

export function useAddPostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PostCreateInput) => createPost(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueriesData<any>({ queryKey: ['posts'] });

      const tempId = Date.now();
      prev.forEach(([key, data]) => {
        if (!data?.posts) return;
        qc.setQueryData(key, {
          ...data,
          posts: [
            { id: tempId, reactions: { likes: 0, dislikes: 0 }, tags: [], ...input },
            ...data.posts,
          ],
          total: (data.total ?? 0) + 1,
        });
      });

      return { prev, tempId };
    },
    onError: (_e, _v, ctx) => {
      ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data));
    },
    // useAddPostMutation() 안의 onSuccess 수정
    onSuccess: (serverPost, _vars, ctx) => {
      if (!ctx) return;
      const { prev, tempId } = ctx as { prev: any; tempId: number };
      prev.forEach(([key, data]: any) => {
        if (!data?.posts) return;
        // 🔧 temp 객체를 서버 응답으로 치환하되, 기존 필드(특히 userId)는 유지
        qc.setQueryData(key, {
          ...data,
          posts: data.posts.map((p: any) =>
            p.id === tempId
              ? {
                  ...p,
                  ...serverPost,
                  userId: p.userId,
                  reactions: p.reactions ?? serverPost.reactions,
                  tags: p.tags ?? serverPost.tags,
                }
              : p,
          ),
        });
      });
    },

    onSettled: () => {
      // MOCK_MODE면 refetch 금지(원복 방지), 실제 백엔드면 refetch로 동기화
      if (!MOCK_MODE) qc.invalidateQueries({ queryKey: ['posts'] });
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
    onError: (_e, _v, ctx) => ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data)),
    onSettled: () => {
      if (!MOCK_MODE) qc.invalidateQueries({ queryKey: ['posts'] });
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
    onError: (_e, _v, ctx) => ctx?.prev?.forEach(([key, data]: any) => qc.setQueryData(key, data)),
    onSettled: () => {
      if (!MOCK_MODE) qc.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
