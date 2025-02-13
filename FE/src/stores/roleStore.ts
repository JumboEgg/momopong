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
  setRoles: (inviterRole: StoryRole, inviteeRole: StoryRole, bookId: number) => void;
  clearRoles: () => void;
  getCurrentRole: (userId: number) => StoryRole | null;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set, get) => ({
      inviterRole: null,
      inviteeRole: null,
      bookId: null,
      setRoles: (inviterRole, inviteeRole, bookId) => {
        console.log('Setting roles:', { inviterRole, inviteeRole, bookId });
        set({ inviterRole, inviteeRole, bookId });
      },
      clearRoles: () => set({ inviterRole: null, inviteeRole: null, bookId: null }),
      getCurrentRole: (userId) => {
        const state = get();
        const currentChildId = tokenService.getCurrentChildId();
        return userId === currentChildId ? state.inviterRole : state.inviteeRole;
      },
    }),
    {
      name: 'story-role-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
