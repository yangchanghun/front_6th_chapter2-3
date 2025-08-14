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
import { useUpdatePostMutation } from '../../../entities/post/model/mutations';

export default function EditPostDialog() {
  const { showEdit, closeEdit, selectedPost, patchSelectedPost } = usePostEditorStore();
  const updatePost = useUpdatePostMutation();

  return (
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
              updatePost.mutate(
                { id: selectedPost.id, title: selectedPost.title, body: selectedPost.body },
                { onSuccess: () => closeEdit() },
              );
            }}
            disabled={updatePost.isPending}
          >
            {updatePost.isPending ? '업데이트 중...' : '게시물 업데이트'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
