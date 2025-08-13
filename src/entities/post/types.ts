export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags?: string[];
  reactions?: { likes?: number; dislikes?: number };
  author?: { id: number; username: string; image?: string };
};

export type PostListResponse = { posts: Post[]; total: number };
