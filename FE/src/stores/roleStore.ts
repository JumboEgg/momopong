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
        console.log('🚀역할 배정 로그🚀', {
          inviterRole: STORY_ROLES.PRINCESS, // 로그에 이 값들도 추가
          inviteeRole: STORY_ROLES.PRINCE,
          inviterId,
          inviteeId,
        });

        set({
          inviterId,
          inviterRole: STORY_ROLES.PRINCESS, // 고정
          inviteeRole: STORY_ROLES.PRINCE, // 고정
          bookId,
          role1UserId: inviterId, // 초대자는 항상 role1(PRINCESS)
          role2UserId: inviteeId, // 초대받은 사람은 항상 role2(PRINCE)
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

      setRole1RecordId: (id) => set({ role1RecordId: id }),
      setRole2RecordId: (id) => set({ role2RecordId: id }),
    }),
    {
      name: 'story-role-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
