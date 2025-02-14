import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { tokenService } from '@/services/tokenService';

export type StoryRole = 'role1' | 'role2';

export const STORY_ROLES = {
  PRINCESS: 'role1',
  PRINCE: 'role2',
} as const;

interface RoleState {
  inviterRole: StoryRole | null;
  inviteeRole: StoryRole | null;
  bookId: number | null;
  // 역할에 매핑된 사용자 ID 추가
  role1UserId: number | null;
  role2UserId: number | null;
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
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      inviterRole: null,
      inviteeRole: null,
      bookId: null,
      role1UserId: null,
      role2UserId: null,

      setRoles: (inviterRole, inviteeRole, bookId, inviterId, inviteeId) => {
        console.log('Setting roles:', {
 inviterRole, inviteeRole, bookId, inviterId, inviteeId,
});
        set({
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

      getCurrentRole: (userId) => {
        const state = get();
        const currentChildId = tokenService.getCurrentChildId();
        return userId === currentChildId ? state.inviterRole : state.inviteeRole;
      },

      getUserIdByRole: (role) => {
        const state = get();
        return role === STORY_ROLES.PRINCESS ? state.role1UserId : state.role2UserId;
      },
    }),
    {
      name: 'story-role-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
