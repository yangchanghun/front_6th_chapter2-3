import { create } from 'zustand';

type SortOrder = 'asc' | 'desc';

type PostListState = {
  skip: number;
  limit: number;
  search: string;
  sortBy: 'none' | 'id' | 'title' | 'reactions';
  sortOrder: SortOrder;
  tag: string; // "" | "all" | tag-slug

  setSkip: (v: number) => void;
  setLimit: (v: number) => void;
  setSearch: (v: string) => void;
  setSortBy: (v: PostListState['sortBy']) => void;
  setSortOrder: (v: SortOrder) => void;
  setTag: (v: string) => void;
  resetPage: () => void;
};

export const usePostListStore = create<PostListState>((set) => ({
  skip: 0,
  limit: 10,
  search: '',
  sortBy: 'none',
  sortOrder: 'asc',
  tag: '',

  setSkip: (v) => set({ skip: v }),
  setLimit: (v) => set({ limit: v }),
  setSearch: (v) => set({ search: v }),
  setSortBy: (v) => set({ sortBy: v }),
  setSortOrder: (v) => set({ sortOrder: v }),
  setTag: (v) => set({ tag: v }),
  resetPage: () => set({ skip: 0 }),
}));
