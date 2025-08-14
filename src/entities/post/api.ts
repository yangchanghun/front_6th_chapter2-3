import type {
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostListResponse,
  PostSearchResponse,
  TagItem,
} from './types';

export async function fetchPosts(params: {
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  tag?: string;
}): Promise<PostListResponse> {
  const { limit, skip, sortBy, sortOrder } = params;

  // 태그 필터는 별도 엔드포인트가 있으므로 여기선 기본 목록 API 사용
  const url = new URL(`/api/posts`, window.location.origin);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));
  if (sortBy && sortBy !== 'none') url.searchParams.set('sortBy', sortBy);
  if (sortOrder) url.searchParams.set('sortOrder', sortOrder);

  const res = await fetch(url.toString().replace(window.location.origin, ''));
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPostsByTag(tag: string): Promise<PostListResponse> {
  const res = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`);
  if (!res.ok) throw new Error('Failed to fetch posts by tag');
  return res.json();
}

export async function searchPosts(q: string): Promise<PostSearchResponse> {
  const res = await fetch(`/api/posts/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Failed to search posts');
  return res.json();
}

export async function fetchTags(): Promise<TagItem[]> {
  const res = await fetch(`/api/posts/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

// ... (기존 fetchPosts, fetchPostsByTag, searchPosts, fetchTags 그대로)

export async function createPost(input: PostCreateInput): Promise<Post> {
  const res = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

export async function updatePost(input: PostUpdateInput): Promise<Post> {
  const res = await fetch(`/api/posts/${input.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete post');
}
