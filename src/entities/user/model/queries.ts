import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsersLite } from '../api';
import type { UsersLiteResponse, UserLite } from '../types';

export function useUsersLiteMapQuery() {
  const { data, ...rest } = useQuery<UsersLiteResponse>({
    queryKey: ['users', 'lite'],
    queryFn: fetchUsersLite,
    staleTime: 1000 * 60 * 10,
  });

  const map = useMemo(() => {
    const m = new Map<number, UserLite>();
    data?.users.forEach((u) => m.set(u.id, u));
    return m;
  }, [data]);

  return { usersMap: map, ...rest };
}

import { fetchUserDetail } from '../api';
export function useUserDetailQuery(id: number | null) {
  return useQuery({
    queryKey: ['user', 'detail', id],
    queryFn: () => fetchUserDetail(id as number),
    enabled: !!id,
  });
}
