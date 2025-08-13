import { useQuery } from '@tanstack/react-query';
import { getUserDetail } from './api';

export function useUserDetail(id: number | null, enabled?: boolean) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserDetail(id as number),
    enabled: !!id && (enabled ?? true),
  });
}
