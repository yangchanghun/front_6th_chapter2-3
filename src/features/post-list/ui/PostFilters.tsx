import { Search } from 'lucide-react';
import { usePostListStore } from '../../post-list/model/store';
import { usePostTagsQuery } from '../../../entities/post/model/queries';
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui';

export default function PostFilters() {
  const { data: tagsData } = usePostTagsQuery();

  const { search, tag, sortBy, sortOrder, setSearch, setTag, setSortBy, setSortOrder, resetPage } =
    usePostListStore();

  return (
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
  );
}
