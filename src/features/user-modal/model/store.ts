import { create } from 'zustand';

type State = {
  open: boolean;
  userId: number | null;
  openModal: (userId: number) => void;
  closeModal: () => void;
};

export const useUserModalStore = create<State>((set) => ({
  open: false,
  userId: null,
  openModal: (userId) => set({ open: true, userId }),
  closeModal: () => set({ open: false }),
}));
