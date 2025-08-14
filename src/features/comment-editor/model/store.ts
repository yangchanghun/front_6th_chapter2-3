import { create } from 'zustand';
import type { Comment } from '../../../entities/comment/types';

type State = {
  showAdd: boolean;
  showEdit: boolean;
  targetPostId: number | null;
  selectedComment: Comment | null;
  newCommentBody: string;

  openAdd: (postId: number) => void;
  closeAdd: () => void;
  openEdit: (c: Comment) => void;
  closeEdit: () => void;

  setSelectedComment: (c: Comment | null) => void;
  setNewCommentBody: (v: string) => void;
};

export const useCommentEditorStore = create<State>((set) => ({
  showAdd: false,
  showEdit: false,
  targetPostId: null,
  selectedComment: null,
  newCommentBody: '',

  openAdd: (postId) => set({ showAdd: true, targetPostId: postId }),
  closeAdd: () => set({ showAdd: false, newCommentBody: '' }),
  openEdit: (c) => set({ showEdit: true, selectedComment: c }),
  closeEdit: () => set({ showEdit: false }),
  setSelectedComment: (c) => set({ selectedComment: c }),
  setNewCommentBody: (v) => set({ newCommentBody: v }),
}));
