// src/pages/PostsManagerPage.tsx
import { useMemo } from 'react';
import { Edit2, MessageSquare, Plus, Search, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';

import { usePostTagsQuery, usePostsQuery } from '../entities/post/model/queries';
import { useUsersLiteMapQuery, useUserDetailQuery } from '../entities/user/model/queries';
import { useCommentsQuery } from '../entities/comment/model/queries';

import {
  useAddPostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} from '../entities/post/model/mutations';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from '../entities/comment/model/mutations';

import { usePostListStore } from '../features/post-list/model/store';
import { usePostEditorStore } from '../features/post-editor/model/store';
import { useCommentEditorStore } from '../features/comment-editor/model/store';
import { useUserModalStore } from '../features/user-modal/model/store';

import { useSyncPostListURL } from '../shared/lib/urlQuery';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '../shared/ui';

// 하이라이트 유틸
const highlightText = (text: string | undefined, highlight: string) => {
  if (!text) return null;
  if (!highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
};

export default function PostsManagerPage() {
  // URL <-> Zustand 동기화
  useSyncPostListURL();

  // 목록/필터 전역 상태
  const {
    skip,
    limit,
    search,
    sortBy,
    sortOrder,
    tag,
    setSkip,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    setTag,
    resetPage,
  } = usePostListStore();

  // 모달/폼 상태 (게시물)
  const {
    showAdd,
    showEdit,
    showDetail,
    selectedPost,
    openAdd,
    closeAdd,
    openEdit,
    closeEdit,
    openDetail,
    closeDetail,
    newPostDraft,
    setNewPostDraft,
    resetNewPostDraft,
    patchSelectedPost,
  } = usePostEditorStore();

  // 모달/폼 상태 (댓글)
  const {
    showAdd: showAddComment,
    showEdit: showEditComment,
    targetPostId,
    selectedComment,
    openAdd: openAddComment,
    closeAdd: closeAddComment,
    openEdit: openEditComment,
    closeEdit: closeEditComment,
    setSelectedComment,
    newCommentBody,
    setNewCommentBody,
  } = useCommentEditorStore();

  // 사용자 모달 상태
  const {
    open: showUserModal,
    userId,
    openModal: openUserModal,
    closeModal: closeUserModal,
  } = useUserModalStore();

  // 쿼리들
  const { data: tagsData } = usePostTagsQuery();
  const { usersMap } = useUsersLiteMapQuery();

  const { data, isLoading } = usePostsQuery({
    limit,
    skip,
    sortBy,
    sortOrder,
    tag,
    search,
  });

  const postIdForComments = showDetail ? (selectedPost?.id ?? null) : null;
  const { data: commentsData } = useCommentsQuery(postIdForComments);
  const { data: userDetail } = useUserDetailQuery(showUserModal ? userId : null);

  // posts + author 매핑
  const posts = useMemo(() => {
    const list = (data as any)?.posts ?? [];
    return list.map((p: any) => ({
      ...p,
      author: usersMap.get(p.userId),
    }));
  }, [data, usersMap]);

  const total = (data as any)?.total ?? 0;

  // 뮤테이션 훅
  const addPostMutation = useAddPostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const deletePostMutation = useDeletePostMutation();

  const addCommentMutation = useAddCommentMutation(postIdForComments);
  const updateCommentMutation = useUpdateCommentMutation(postIdForComments);
  const deleteCommentMutation = useDeleteCommentMutation(postIdForComments);
  const likeCommentMutation = useLikeCommentMutation(postIdForComments);

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
          {/* 검색/필터 */}
          <div className='flex gap-4'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='게시물 검색...'
                  className='pl-8'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetPage();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') resetPage();
                  }}
                />
              </div>
            </div>

            <Select
              value={tag || 'all'}
              onValueChange={(value) => {
                setTag(value === 'all' ? '' : value);
                resetPage();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='태그 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>모든 태그</SelectItem>
                {(tagsData ?? []).map((t: any) => {
                  const slug = typeof t === 'string' ? t : t.slug;
                  return (
                    <SelectItem key={slug} value={slug}>
                      {slug}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(v) => {
                setSortBy(v as any);
                resetPage();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 기준' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='none'>없음</SelectItem>
                <SelectItem value='id'>ID</SelectItem>
                <SelectItem value='title'>제목</SelectItem>
                <SelectItem value='reactions'>반응</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(v) => {
                setSortOrder(v as 'asc' | 'desc');
                resetPage();
              }}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='정렬 순서' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>오름차순</SelectItem>
                <SelectItem value='desc'>내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 테이블 */}
          {isLoading ? (
            <div className='flex justify-center p-4'>로딩 중...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className='w-[150px]'>작성자</TableHead>
                  <TableHead className='w-[150px]'>반응</TableHead>
                  <TableHead className='w-[150px]'>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.id}</TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div>{highlightText(post.title, search)}</div>
                        <div className='flex flex-wrap gap-1'>
                          {post.tags?.map((tg: string) => (
                            <span
                              key={tg}
                              className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                                (tag || '') === tg
                                  ? 'text-white bg-blue-500 hover:bg-blue-600'
                                  : 'text-blue-800 bg-blue-100 hover:bg-blue-200'
                              }`}
                              onClick={() => {
                                setTag(tg);
                                resetPage();
                              }}
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className='flex items-center space-x-2 cursor-pointer'
                        onClick={() => post.author?.id && openUserModal(post.author.id)}
                      >
                        {post.author?.image && (
                          <img
                            src={post.author.image}
                            alt={post.author.username}
                            className='w-8 h-8 rounded-full'
                          />
                        )}
                        <span>{post.author?.username ?? '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <ThumbsUp className='w-4 h-4' />
                        <span>{post.reactions?.likes ?? 0}</span>
                        <ThumbsDown className='w-4 h-4' />
                        <span>{post.reactions?.dislikes ?? 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button variant='ghost' size='sm' onClick={() => openDetail(post)}>
                          <MessageSquare className='w-4 h-4' />
                        </Button>
                        <Button variant='ghost' size='sm' onClick={() => openEdit(post)}>
                          <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deletePostMutation.mutate(post.id)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* 페이지네이션 */}
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span>표시</span>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  const n = Number(v);
                  setLimit(n);
                  resetPage();
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='10' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='30'>30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>

            <div className='flex gap-2'>
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      {/* ---------------- Modals ---------------- */}

      {/* 게시물 추가 */}
      <Dialog open={showAdd} onOpenChange={(o) => !o && closeAdd()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 게시물 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={newPostDraft.title}
              onChange={(e) => setNewPostDraft({ title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder='내용'
              value={newPostDraft.body}
              onChange={(e) => setNewPostDraft({ body: e.target.value })}
            />
            <Input
              type='number'
              placeholder='사용자 ID'
              value={newPostDraft.userId}
              onChange={(e) => setNewPostDraft({ userId: Number(e.target.value) || 1 })}
            />
            <Button
              onClick={() => {
                addPostMutation.mutate(newPostDraft, {
                  onSuccess: () => {
                    resetNewPostDraft();
                    closeAdd();
                  },
                });
              }}
              disabled={addPostMutation.isPending}
            >
              {addPostMutation.isPending ? '추가 중...' : '게시물 추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 수정 */}
      <Dialog open={showEdit} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시물 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder='제목'
              value={selectedPost?.title ?? ''}
              onChange={(e) => patchSelectedPost({ title: e.target.value })}
            />
            <Textarea
              rows={15}
              placeholder='내용'
              value={selectedPost?.body ?? ''}
              onChange={(e) => patchSelectedPost({ body: e.target.value })}
            />
            <Button
              onClick={() => {
                if (!selectedPost) return;
                updatePostMutation.mutate(
                  { id: selectedPost.id, title: selectedPost.title, body: selectedPost.body },
                  { onSuccess: () => closeEdit() },
                );
              }}
              disabled={updatePostMutation.isPending}
            >
              {updatePostMutation.isPending ? '업데이트 중...' : '게시물 업데이트'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 게시물 상세 (댓글 포함) */}
      <Dialog open={showDetail} onOpenChange={(o) => !o && closeDetail()}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, search)}</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <p>{highlightText(selectedPost?.body, search)}</p>

            {/* 댓글 리스트 */}
            <div className='mt-2'>
              <div className='flex items-center justify-between mb-2'>
                <h3 className='text-sm font-semibold'>댓글</h3>
                {selectedPost?.id && (
                  <Button size='sm' onClick={() => openAddComment(selectedPost.id!)}>
                    <Plus className='w-3 h-3 mr-1' /> 댓글 추가
                  </Button>
                )}
              </div>

              <div className='space-y-1'>
                {(commentsData?.comments ?? []).map((comment) => (
                  <div
                    key={comment.id}
                    className='flex items-center justify-between text-sm border-b pb-1'
                  >
                    <div className='flex items-center space-x-2 overflow-hidden'>
                      <span className='font-medium truncate'>{comment.user.username}:</span>
                      <span className='truncate'>{highlightText(comment.body, search)}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() =>
                          likeCommentMutation.mutate({
                            id: comment.id,
                            nextLikes: (comment.likes ?? 0) + 1,
                          })
                        }
                      >
                        <ThumbsUp className='w-3 h-3' />
                        <span className='ml-1 text-xs'>{comment.likes ?? 0}</span>
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => openEditComment(comment)}>
                        <Edit2 className='w-3 h-3' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteCommentMutation.mutate(comment.id)}
                      >
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 */}
      <Dialog open={showAddComment} onOpenChange={(o) => !o && closeAddComment()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={newCommentBody}
              onChange={(e) => setNewCommentBody(e.target.value)}
            />
            <Button
              onClick={() => {
                if (!targetPostId) return;
                addCommentMutation.mutate(
                  { postId: targetPostId, body: newCommentBody, userId: 1 },
                  { onSuccess: () => closeAddComment() },
                );
              }}
              disabled={addCommentMutation.isPending}
            >
              {addCommentMutation.isPending ? '추가 중...' : '댓글 추가'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 */}
      <Dialog open={showEditComment} onOpenChange={(o) => !o && closeEditComment()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Textarea
              placeholder='댓글 내용'
              value={selectedComment?.body ?? ''}
              onChange={(e) =>
                selectedComment && setSelectedComment({ ...selectedComment, body: e.target.value })
              }
            />
            <Button
              onClick={() => {
                if (!selectedComment) return;
                updateCommentMutation.mutate(
                  { id: selectedComment.id, body: selectedComment.body },
                  { onSuccess: () => closeEditComment() },
                );
              }}
              disabled={updateCommentMutation.isPending}
            >
              {updateCommentMutation.isPending ? '업데이트 중...' : '댓글 업데이트'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={(o) => !o && closeUserModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            {userDetail?.image && (
              <img
                src={userDetail.image}
                alt={userDetail.username}
                className='w-24 h-24 rounded-full mx-auto'
              />
            )}
            <h3 className='text-xl font-semibold text-center'>{userDetail?.username}</h3>
            {/* 필요 시 상세 필드 추가 */}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
