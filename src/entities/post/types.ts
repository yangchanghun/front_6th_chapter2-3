export type Reaction = {
  likes: number;
  dislikes: number;
};

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: Reaction;
};

export type PostListResponse = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
};

export type PostSearchResponse = {
  posts: Post[];
  total: number;
};

export type TagItem = { slug: string; url?: string } | string;

export type PostCreateInput = { title: string; body: string; userId: number };
export type PostUpdateInput = { id: number; title?: string; body?: string; userId?: number };

import type { UserLite } from '../user/types';

export type PostWithAuthor = Post & {
  author?: UserLite;
};
