import { create } from 'zustand';

type PostsUIState = {
  // UI 전용 상태들(모달/선택/폼 draft 등) — 지금은 빈 껍데기
  // 다음 단계에서 실제 필드 추가
};
export const usePostsUI = create<PostsUIState>(() => ({}));
