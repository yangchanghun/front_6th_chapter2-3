import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Textarea,
} from '../../../shared/ui';
import { usePostEditorStore } from '../model/store';
import { useAddPostMutation } from '../../../entities/post/model/mutations';

export default function AddPostDialog() {
  const { showAdd, closeAdd, newPostDraft, setNewPostDraft, resetNewPostDraft } =
    usePostEditorStore();
  const addPost = useAddPostMutation();

  return (
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
              addPost.mutate(newPostDraft, {
                onSuccess: () => {
                  resetNewPostDraft();
                  closeAdd();
                },
              })
            }
            disabled={addPost.isPending}
          >
            {addPost.isPending ? '추가 중...' : '게시물 추가'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
