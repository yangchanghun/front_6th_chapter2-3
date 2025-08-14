import { create } from 'zustand';
import type { Post } from '../../../entities/post/types';

type NewPostDraft = { title: string; body: string; userId: number };

type State = {
  showAdd: boolean;
  showEdit: boolean;
  showDetail: boolean;
  selectedPost: Post | null;

  newPostDraft: NewPostDraft;

  openAdd: () => void;
  closeAdd: () => void;
  openEdit: (post: Post) => void;
  closeEdit: () => void;
  openDetail: (post: Post) => void;
  closeDetail: () => void;

  setSelectedPost: (p: Post | null) => void;
  patchSelectedPost: (patch: Partial<Post>) => void;

  setNewPostDraft: (patch: Partial<NewPostDraft>) => void;
  resetNewPostDraft: () => void;
};

export const usePostEditorStore = create<State>((set) => ({
  showAdd: false,
  showEdit: false,
  showDetail: false,
  selectedPost: null,

  newPostDraft: { title: '', body: '', userId: 1 },

  openAdd: () => set({ showAdd: true }),
  closeAdd: () => set({ showAdd: false }),
  openEdit: (post) => set({ showEdit: true, selectedPost: post }),
  closeEdit: () => set({ showEdit: false }),
  openDetail: (post) => set({ showDetail: true, selectedPost: post }),
  closeDetail: () => set({ showDetail: false }),
  setSelectedPost: (p) => set({ selectedPost: p }),
  patchSelectedPost: (patch) =>
    set((s) => (s.selectedPost ? { selectedPost: { ...s.selectedPost, ...patch } } : s)),
  setNewPostDraft: (patch) => set((s) => ({ newPostDraft: { ...s.newPostDraft, ...patch } })),
  resetNewPostDraft: () => set({ newPostDraft: { title: '', body: '', userId: 1 } }),
}));
