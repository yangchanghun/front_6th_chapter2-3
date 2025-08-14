import { useQuery } from '@tanstack/react-query';
import { fetchCommentsByPost } from '../api';
import { MOCK_MODE } from '../../../shared/config';
export function useCommentsQuery(postId: number | null) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentsByPost(postId as number),
    enabled: !!postId,
    // 🔧 MOCK_MODE일 땐 캐시 유지 + 리패치 억제
    staleTime: MOCK_MODE ? Infinity : 0,
    gcTime: MOCK_MODE ? Infinity : 5 * 60 * 1000,
    refetchOnMount: MOCK_MODE ? false : 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
