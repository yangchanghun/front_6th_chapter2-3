import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByPost } from '../api';

export function useCommentsQuery(postId: number | null) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPost(postId as number),
    enabled: !!postId,
  });
}
