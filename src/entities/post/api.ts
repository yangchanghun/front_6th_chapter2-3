import { http } from '../../shared/lib/http';
import type { Post, PostListResponse } from './types';
import type { UserBasic } from '../user/types';

/**
 * 기본 목록 (페이지네이션)
 */
export function getPosts(params: { skip: number; limit: number }) {
  const { skip, limit } = params;
  return http<PostListResponse>(`/api/posts?limit=${limit}&skip=${skip}`);
}

/**
 * 검색
 */
export function searchPosts(q: string) {
  const query = encodeURIComponent(q);
  return http<PostListResponse>(`/api/posts/search?q=${query}`);
}

/**
 * 태그별 목록
 */
export function getPostsByTag(tag: string) {
  const t = encodeURIComponent(tag);
  return http<PostListResponse>(`/api/posts/tag/${t}`);
}

/**
 * 태그 리스트
 * 서버 응답이 [{url, slug}] 형태라고 했으니 그대로 타입 없이 사용
 */
export function getPostTags() {
  return http<Array<{ url: string; slug: string }>>(`/api/posts/tags`);
}

/**
 * 사용자 기본 목록 (author 붙이기 위한)
 */
export function getUsersBasic() {
  return http<{ users: UserBasic[] }>(`/api/users?limit=0&select=username,image`);
}

/**
 * 게시물 추가/수정/삭제
 */
export function addPost(payload: { title: string; body: string; userId: number }) {
  return http<Post>(`/api/posts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updatePost(id: number, payload: Partial<Post>) {
  return http<Post>(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function deletePost(id: number) {
  return http<void>(`/api/posts/${id}`, { method: 'DELETE' });
}

/**
 * 도우미: posts + author 조합
 * (페이지에서 map으로 합치던 로직을 API 레벨로 이동 — 선택)
 */
export async function getPostsWithAuthors(params: { skip: number; limit: number }) {
  const [postsRes, usersRes] = await Promise.all([getPosts(params), getUsersBasic()]);
  const users = usersRes.users;
  const posts = postsRes.posts.map((p) => ({
    ...p,
    author: users.find((u) => u.id === p.userId),
  }));
  return { posts, total: postsRes.total };
}

export async function getPostsByTagWithAuthors(tag: string) {
  const [postsRes, usersRes] = await Promise.all([getPostsByTag(tag), getUsersBasic()]);
  const users = usersRes.users;
  const posts = postsRes.posts.map((p) => ({
    ...p,
    author: users.find((u) => u.id === p.userId),
  }));
  return { posts, total: postsRes.total };
}
