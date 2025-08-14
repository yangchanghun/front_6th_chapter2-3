// src/entities/comment/api.ts
import type { Comment } from './types';

// 댓글 목록 (postId 기준)
export async function fetchCommentsByPost(postId: number): Promise<{ comments: Comment[] }> {
  const res = await fetch(`/api/comments/post/${postId}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

// 댓글 추가
export async function createComment(input: {
  postId: number;
  body: string;
  userId: number;
}): Promise<Comment> {
  const res = await fetch('/api/comments/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create comment');
  return res.json();
}

// 댓글 수정
export async function updateComment(input: { id: number; body: string }): Promise<Comment> {
  const res = await fetch(`/api/comments/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: input.body }),
  });
  if (!res.ok) throw new Error('Failed to update comment');
  return res.json();
}

// 댓글 삭제
export async function deleteComment(id: number): Promise<void> {
  const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
}

// 좋아요 (likes 수 변경)
export async function likeComment(input: { id: number; likes: number }): Promise<Comment> {
  const res = await fetch(`/api/comments/${input.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: input.likes }),
  });
  if (!res.ok) throw new Error('Failed to like comment');
  return res.json();
}
