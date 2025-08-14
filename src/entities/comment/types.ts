export type Comment = {
  id: number;
  body: string;
  postId: number;
  user: { id: number; username: string };
  likes: number;
};
