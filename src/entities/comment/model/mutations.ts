import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, deleteComment, updateComment, likeComment } from '../api';
import type { Comment } from '../types';
import { MOCK_MODE } from '../../../shared/config';

export function useAddCommentMutation(postId: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { postId: number; body: string; userId: number }) => createComment(input),
    onMutate: async (input) => {
      if (!postId) return;
      await qc.cancelQueries({ queryKey: ['comments', postId] });
      const key = ['comments', postId];
      const prev = qc.getQueryData<any>(key);
      const tempId = Date.now();

      qc.setQueryData(key, {
        comments: [
          ...(prev?.comments ?? []),
          {
            id: tempId,
            postId: input.postId,
            body: input.body,
            likes: 0,
            user: { id: input.userId, username: 'You' },
          },
        ],
      });

      return { key, prev, tempId };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSuccess: (serverComment, _vars, ctx) => {
      if (!ctx) return;
      const { key, tempId } = ctx as any;
      const cur = qc.getQueryData<any>(key);
      if (!cur?.comments) return;
      qc.setQueryData(key, {
        comments: cur.comments.map((c: Comment) => (c.id === tempId ? serverComment : c)),
      });
    },
    onSettled: () => {
      if (!MOCK_MODE && postId) qc.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

export function useUpdateCommentMutation(postId: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: number; body: string }) => updateComment(input),
    onMutate: async (input) => {
      if (!postId) return;
      await qc.cancelQueries({ queryKey: ['comments', postId] });
      const key = ['comments', postId];
      const prev = qc.getQueryData<any>(key);

      qc.setQueryData(key, {
        comments: (prev?.comments ?? []).map((c: Comment) =>
          c.id === input.id ? { ...c, body: input.body } : c,
        ),
      });

      return { key, prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSettled: () => {
      if (!MOCK_MODE && postId) qc.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

export function useDeleteCommentMutation(postId: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteComment(id),
    onMutate: async (id) => {
      if (!postId) return;
      await qc.cancelQueries({ queryKey: ['comments', postId] });
      const key = ['comments', postId];
      const prev = qc.getQueryData<any>(key);

      qc.setQueryData(key, {
        comments: (prev?.comments ?? []).filter((c: Comment) => c.id !== id),
      });

      return { key, prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSettled: () => {
      if (!MOCK_MODE && postId) qc.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}

// 서버가 likes를 저장하지 않을 수 있어 '낙관적 업데이트'만 유지
export function useLikeCommentMutation(postId: number | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: number; nextLikes: number }) =>
      likeComment({ id: input.id, likes: input.nextLikes }), // 서버가 무시해도 OK
    onMutate: async ({ id }) => {
      if (!postId) return;
      await qc.cancelQueries({ queryKey: ['comments', postId] });
      const key = ['comments', postId];
      const prev = qc.getQueryData<any>(key);

      qc.setQueryData(key, {
        comments: (prev?.comments ?? []).map((c: Comment) =>
          c.id === id ? { ...c, likes: (c.likes ?? 0) + 1 } : c,
        ),
      });

      return { key, prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSettled: () => {
      // MOCK_MODE면 invalidate 안 함 (원복 방지)
      if (!MOCK_MODE && postId) qc.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });
}
