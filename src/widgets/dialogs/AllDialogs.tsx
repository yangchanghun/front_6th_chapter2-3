import AddPostDialog from '../../features/post-editor/ui/AddPostDialog';
import EditPostDialog from '../../features/post-editor/ui/EditPostDialog';
import AddCommentDialog from '../../features/comment-editor/ui/AddCommentDialog';
import EditCommentDialog from '../../features/comment-editor/ui/EditCommentDialog';
import UserDialog from '../../features/user-modal/ui/UserDialog';
import PostDetailDialog from '../post-detail/PostDetailDialog';

export default function AllDialogs() {
  return (
    <>
      <AddPostDialog />
      <EditPostDialog />
      <PostDetailDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <UserDialog />
    </>
  );
}
