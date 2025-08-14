import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '../../shared/ui';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { usePostEditorStore } from '../../features/post-editor/model/store';
import { usePostListStore } from '../../features/post-list/model/store';
import { Highlight } from '../../shared/lib/highlight';
import { useCommentsQuery } from '../../entities/comment/model/queries';
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from '../../entities/comment/model/mutations';
import { useCommentEditorStore } from '../../features/comment-editor/model/store';

export default function PostDetailDialog() {
  const { showDetail, closeDetail, selectedPost } = usePostEditorStore();
  const { search } = usePostListStore();

  const postId = selectedPost?.id ?? null;
  const { data: commentsData } = useCommentsQuery(postId);

  const { openAdd: openAddComment, openEdit: openEditComment } = useCommentEditorStore();
  const deleteComment = useDeleteCommentMutation(postId);
  const likeComment = useLikeCommentMutation(postId);

  return (
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

          <div className='mt-2'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-sm font-semibold'>댓글</h3>
              {postId && (
                <Button size='sm' onClick={() => openAddComment(postId)}>
                  <Plus className='w-3 h-3 mr-1' /> 댓글 추가
                </Button>
              )}
            </div>

            <div className='space-y-1'>
              {(commentsData?.comments ?? []).map((c) => (
                <div key={c.id} className='flex items-center justify-between text-sm border-b pb-1'>
                  <div className='flex items-center space-x-2 overflow-hidden'>
                    <span className='font-medium truncate'>{c.user.username}:</span>
                    <span className='truncate'>
                      <Highlight text={c.body} q={search} />
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        likeComment.mutate({ id: c.id, nextLikes: (c.likes ?? 0) + 1 })
                      }
                    >
                      👍 <span className='ml-1 text-xs'>{c.likes ?? 0}</span>
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => openEditComment(c)}>
                      <Edit2 className='w-3 h-3' />
                    </Button>
                    <Button variant='ghost' size='sm' onClick={() => deleteComment.mutate(c.id)}>
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
  );
}
