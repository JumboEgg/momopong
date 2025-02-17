import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenService } from '@/services/tokenService';

export type StoryRole = 'role1' | 'role2';

export const STORY_ROLES = {
  PRINCESS: 'role1',
  PRINCE: 'role2',
} as const;

interface RoleState {
  inviterId: number | null;
  inviterRole: StoryRole | null;
  inviteeRole: StoryRole | null;
  bookId: number | null;

  // 역할에 매핑된 사용자 ID
  role1UserId: number | null;
  role2UserId: number | null;

  // 독서 기록 저장 id
  role1RecordId: number | null;
  role2RecordId: number | null;

  setRoles: (
    inviterRole: StoryRole,
    inviteeRole: StoryRole,
    bookId: number,
    inviterId: number,
    inviteeId: number
  ) => void;
  clearRoles: () => void;
  getCurrentRole: (userId: number) => StoryRole | null;
  getUserIdByRole: (role: StoryRole) => number | null;

  setRole1RecordId: (id: number | null) => void;
  setRole2RecordId: (id: number | null) => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      inviterId: null,
      inviterRole: null,
      inviteeRole: null,
      bookId: null,
      role1UserId: null,
      role2UserId: null,
      role1RecordId: null,
      role2RecordId: null,

      setRoles: (inviterRole, inviteeRole, bookId, inviterId, inviteeId) => {
        console.log('Setting roles:', {
          inviterRole, inviteeRole, bookId, inviterId, inviteeId,
        });
        set({
          inviterId,
          inviterRole,
          inviteeRole,
          bookId,
          role1UserId: inviterRole === STORY_ROLES.PRINCESS ? inviterId : inviteeId,
          role2UserId: inviterRole === STORY_ROLES.PRINCE ? inviterId : inviteeId,
        });
      },

      clearRoles: () => set({
        inviterRole: null,
        inviteeRole: null,
        bookId: null,
        role1UserId: null,
        role2UserId: null,
      }),

      // getCurrentRole: (userId) => {
      //   const state = get();
      //   const currentChildId = tokenService.getCurrentChildId();
      //   return userId === currentChildId ? state.inviterRole : state.inviteeRole;
      // },
      getCurrentRole: (userId) => {
        const state = get();
        const currentChildId = tokenService.getCurrentChildId();

        console.log('역할 결정 디버그', {
          userId,
          currentChildId,
          role1UserId: state.role1UserId,
          role2UserId: state.role2UserId,
          inviterRole: state.inviterRole,
          inviteeRole: state.inviteeRole,
        });

        // 현재 로그인된 사용자의 ID를 먼저 확인
        if (userId === currentChildId) {
          // 로그인된 사용자가 role1UserId와 일치하면 PRINCESS
          if (currentChildId === state.role1UserId) return STORY_ROLES.PRINCESS;
          // 로그인된 사용자가 role2UserId와 일치하면 PRINCE
          if (currentChildId === state.role2UserId) return STORY_ROLES.PRINCE;
        }

        // 그 외의 경우 기존 로직 유지
        if (userId === state.role1UserId) return STORY_ROLES.PRINCESS;
        if (userId === state.role2UserId) return STORY_ROLES.PRINCE;

        return null;
      },

      getUserIdByRole: (role) => {
        const state = get();
        return role === STORY_ROLES.PRINCESS ? state.role1UserId : state.role2UserId;
      },

      setRole1RecordId: (id) => set({ role1RecordId: id }),
      setRole2RecordId: (id) => set({ role2RecordId: id }),
    }),
    {
      name: 'story-role-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
