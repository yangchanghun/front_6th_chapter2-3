import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '../../../shared/ui';
import { useCommentEditorStore } from '../model/store';
import { useAddCommentMutation } from '../../../entities/comment/model/mutations';

export default function AddCommentDialog() {
  const { showAdd, closeAdd, targetPostId, newCommentBody, setNewCommentBody } =
    useCommentEditorStore();
  const addComment = useAddCommentMutation(targetPostId);

  return (
    <Dialog open={showAdd} onOpenChange={(o) => !o && closeAdd()}>
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
              addComment.mutate(
                { postId: targetPostId, body: newCommentBody, userId: 1 },
                { onSuccess: () => closeAdd() },
              );
            }}
            disabled={addComment.isPending}
          >
            {addComment.isPending ? '추가 중...' : '댓글 추가'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
