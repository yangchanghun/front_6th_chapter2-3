// src/pages/PostsManagerPage.tsx
import { useMemo } from 'react';
import { Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, Button } from '../shared/ui';

import { useSyncPostListURL } from '../shared/lib/urlQuery';
import { usePostListStore } from '../features/post-list/model/store';
import { usePostsQuery } from '../entities/post/model/queries';
import { useUsersLiteMapQuery } from '../entities/user/model/queries';
import { usePostEditorStore } from '../features/post-editor/model/store';

import PostFilters from '../features/post-list/ui/PostFilters';
import PostTable from '../features/post-list/ui/PostTable';
import Pagination from '../features/post-list/ui/Pagination';

import type { PostWithAuthor } from '../entities/post/types';
import AllDialogs from '../widgets/dialogs/AllDialogs';

export default function PostsManagerPage() {
  // URL ↔ 상태 동기화
  useSyncPostListURL();

  // 목록 필터 상태
  const { limit, skip, sortBy, sortOrder, tag, search } = usePostListStore();

  // 데이터 쿼리
  const { usersMap } = useUsersLiteMapQuery();
  const { data, isLoading } = usePostsQuery({ limit, skip, sortBy, sortOrder, tag, search });

  // 모달 트리거
  const { openAdd } = usePostEditorStore();

  // posts + author 매핑
  const posts = useMemo<PostWithAuthor[]>(() => {
    const list = (data as any)?.posts ?? [];
    return list.map((p: any) => ({
      ...p,
      author: usersMap.get(p.userId),
    }));
  }, [data, usersMap]);

  const total = (data as any)?.total ?? 0;

  return (
    <Card className='w-full max-w-6xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>게시물 관리자</span>
          <Button onClick={openAdd}>
            <Plus className='w-4 h-4 mr-2' /> 게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-4'>
          {/* 검색/정렬/태그 필터 */}
          <PostFilters />

          {/* 목록 테이블 */}
          {isLoading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <PostTable posts={posts} />
          )}

          {/* 페이지네이션 */}
          <Pagination total={total} />
        </div>
      </CardContent>

      {/* 모든 모달(게시물/댓글/사용자) */}
      <AllDialogs />
    </Card>
  );
}
