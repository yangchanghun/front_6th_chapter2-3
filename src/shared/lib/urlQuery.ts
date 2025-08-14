import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePostListStore } from '../../features/post-list/model/store';

export function useSyncPostListURL() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    skip,
    limit,
    search,
    sortBy,
    sortOrder,
    tag,
    setSkip,
    setLimit,
    setSearch,
    setSortBy,
    setSortOrder,
    setTag,
  } = usePostListStore();

  // 1) URL -> Store (초기/URL 변경 시)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSkip(parseInt(p.get('skip') || '0'));
    setLimit(parseInt(p.get('limit') || '10'));
    setSearch(p.get('search') || '');
    setSortBy((p.get('sortBy') as any) || 'none');
    setSortOrder((p.get('sortOrder') as any) || 'asc');
    setTag(p.get('tag') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // 2) Store -> URL (상태 바뀔 때)
  useEffect(() => {
    const p = new URLSearchParams();
    if (skip) p.set('skip', String(skip));
    if (limit) p.set('limit', String(limit));
    if (search) p.set('search', search);
    if (sortBy && sortBy !== 'none') p.set('sortBy', sortBy);
    if (sortOrder) p.set('sortOrder', sortOrder);
    if (tag) p.set('tag', tag);

    const next = `?${p.toString()}`;
    if (next !== location.search) {
      navigate(next, { replace: true }); // 히스토리 누적 방지
    }
  }, [skip, limit, search, sortBy, sortOrder, tag, location.search, navigate]);
}
