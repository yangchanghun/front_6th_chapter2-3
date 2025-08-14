import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
} from '../../../shared/ui';
import { Plus } from 'lucide-react';
import { usePostEditorStore } from '../model/store';
import { useCommentEditorStore } from '../../comment-editor/model/store';
import { useUserModalStore } from '../../user-modal/model/store';

import { useCommentsQuery } from '../../../entities/comment/model/queries';
import { useAddPostMutation, useUpdatePostMutation } from '../../../entities/post/model/mutations';
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from '../../../entities/comment/model/mutations';

import { usePostListStore } from '../../post-list/model/store';

function escapeRegex(src: string) {
  return src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function Highlight({ text, q }: { text?: string; q: string }) {
  if (!text) return null;
  if (!q.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${escapeRegex(q)})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
      )}
    </span>
  );
}

export default function Dialogs() {
  const { search } = usePostListStore();

  // post editor store
  const {
    showAdd,
    showEdit,
    showDetail,
    selectedPost,
    openAdd,
    closeAdd,
    closeEdit,
    closeDetail,
    newPostDraft,
    setNewPostDraft,
    resetNewPostDraft,
    patchSelectedPost,
  } = usePostEditorStore();

  // comment editor store
  const {
    showAdd: showAddComment,
    showEdit: showEditComment,
    targetPostId,
    selectedComment,
    closeAdd: closeAddComment,
    closeEdit: closeEditComment,
    openAdd: openAddComment,
    setSelectedComment,
    newCommentBody,
    setNewCommentBody,
  } = useCommentEditorStore();

  // user modal
  const { open: showUserModal, userId, closeModal: closeUserModal } = useUserModalStore();

  // queries
  const postIdForComments = showDetail ? (selectedPost?.id ?? null) : null;
  const { data: commentsData } = useCommentsQuery(postIdForComments);

  // mutations
  const addPostMutation = useAddPostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const addCommentMutation = useAddCommentMutation(postIdForComments);
  const updateCommentMutation = useUpdateCommentMutation(postIdForComments);
  const deleteCommentMutation = useDeleteCommentMutation(postIdForComments);
  const likeCommentMutation = useLikeCommentMutation(postIdForComments);

  return (
    <>
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
              onClick={() =>
                addPostMutation.mutate(newPostDraft, {
                  onSuccess: () => {
                    resetNewPostDraft();
                    closeAdd();
                  },
                })
              }
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
            <DialogTitle>
              <Highlight text={selectedPost?.title} q={search} />
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <p>
              <Highlight text={selectedPost?.body} q={search} />
            </p>

            {/* 댓글 */}
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
                      <span className='truncate'>
                        <Highlight text={comment.body} q={search} />
                      </span>
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
                        👍 <span className='ml-1 text-xs'>{comment.likes ?? 0}</span>
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => setSelectedComment(comment)}>
                        ✏️
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => deleteCommentMutation.mutate(comment.id)}
                      >
                        🗑️
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

      {/* 사용자 모달 (열림/닫힘만 유지; 상세는 기존처럼 필요시 확장) */}
      <Dialog open={showUserModal} onOpenChange={(o) => !o && closeUserModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className='space-y-2'>
            <p>사용자 상세는 user/detail 쿼리로 확장 가능</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
