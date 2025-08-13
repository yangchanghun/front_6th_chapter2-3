import { useQuery } from '@tanstack/react-query';
import { getCommentsByPost } from './api';

export function useComments(postId: number | null, enabled?: boolean) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPost(postId as number),
    select: (d) => d.comments,
    enabled: !!postId && (enabled ?? true),
  });
}
