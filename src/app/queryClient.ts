import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 30초 동안 신선, 포커스 시 자동 refetch 꺼둠 (원하면 켜도 됨)
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
