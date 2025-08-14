import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/ui';
import { useUserModalStore } from '../model/store';
import { useUserDetailQuery } from '../../../entities/user/model/queries';

export default function UserDialog() {
  const { open, userId, closeModal } = useUserModalStore();
  const { data } = useUserDetailQuery(open ? userId : null);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          {data?.image && (
            <img src={data.image} alt={data.username} className='w-24 h-24 rounded-full mx-auto' />
          )}
          <h3 className='text-xl font-semibold text-center'>{data?.username ?? '-'}</h3>
          {/* 필요하면 상세 필드 더 표시 */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
