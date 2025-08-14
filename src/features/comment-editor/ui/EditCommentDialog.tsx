import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Textarea,
} from '../../../shared/ui';
import { useCommentEditorStore } from '../model/store';
import { useUpdateCommentMutation } from '../../../entities/comment/model/mutations';

export default function EditCommentDialog() {
  const { showEdit, closeEdit, selectedComment, setSelectedComment, targetPostId } =
    useCommentEditorStore();
  const updateComment = useUpdateCommentMutation(targetPostId);

  return (
    <Dialog open={showEdit} onOpenChange={(o) => !o && closeEdit()}>
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
              updateComment.mutate(
                { id: selectedComment.id, body: selectedComment.body },
                { onSuccess: () => closeEdit() },
              );
            }}
            disabled={updateComment.isPending}
          >
            {updateComment.isPending ? '업데이트 중...' : '댓글 업데이트'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
