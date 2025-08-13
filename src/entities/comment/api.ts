import { http } from '../../shared/lib/http';
import type { Comment, CommentListResponse } from './types';

/**
 * 특정 게시물의 댓글
 */
export function getCommentsByPost(postId: number) {
  return http<CommentListResponse>(`/api/comments/post/${postId}`);
}

/**
 * 댓글 추가/수정/삭제/좋아요
 */
export function addComment(payload: { body: string; postId: number; userId: number }) {
  return http<Comment>(`/api/comments/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateComment(id: number, payload: { body: string }) {
  return http<Comment>(`/api/comments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deleteComment(id: number) {
  return http<void>(`/api/comments/${id}`, { method: 'DELETE' });
}

export function likeComment(id: number, newLikes: number) {
  return http<Comment>(`/api/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: newLikes }),
  });
}
