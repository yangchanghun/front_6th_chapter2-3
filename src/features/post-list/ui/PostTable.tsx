import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/ui';
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { usePostListStore } from '../../post-list/model/store';
import { usePostEditorStore } from '../../post-editor/model/store';
import { useUserModalStore } from '../../user-modal/model/store';
import { useDeletePostMutation } from '../../../entities/post/model/mutations';

type PostWithAuthor = {
  id: number;
  userId: number; // ✅ 추가
  title: string;
  body: string;
  tags?: string[];
  reactions?: { likes: number; dislikes: number };
  author?: { id: number; username: string; image?: string };
};
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

export default function PostTable({ posts }: { posts: PostWithAuthor[] }) {
  const { search, tag, setTag, resetPage } = usePostListStore();
  const { openDetail, openEdit } = usePostEditorStore();
  const { openModal: openUserModal } = useUserModalStore();
  const deletePostMutation = useDeletePostMutation();

  return (
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
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.id}</TableCell>
            <TableCell>
              <div className='space-y-1'>
                <div>
                  <Highlight text={post.title} q={search} />
                </div>
                <div className='flex flex-wrap gap-1'>
                  {post.tags?.map((tg) => (
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
                  disabled={deletePostMutation.isPending}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
