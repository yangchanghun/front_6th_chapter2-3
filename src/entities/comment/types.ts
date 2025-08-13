export type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: { id: number; username: string };
};
export type CommentListResponse = { comments: Comment[] };
