import { create } from 'zustand';
/* eslint-disable import/no-extraneous-dependencies */
import { Room } from 'livekit-client';

interface MultiplayState {
  userRole: 'prince' | 'princess' | null;
  currentContentIndex: number;
  isLastAudioCompleted: boolean;
  participants: Map<string, {
    role: 'prince' | 'princess' | null,
    currentPage: number
  }>;
  room: Room | null,

  setUserRole: (role: 'prince' | 'princess' | null) => void;
  setCurrentContentIndex: (index: number | ((prev: number) => number)) => void;
  setLastAudioCompleted: (completed: boolean) => void;
  updateParticipant: (participantId: string, data: {
    role?: 'prince' | 'princess' | null;
    currentPage?: number;
  }) => void;
}

export const useMultiplayStore = create<MultiplayState>((set, get) => ({
  userRole: null,
  currentContentIndex: 0,
  isLastAudioCompleted: false,
  participants: new Map(),
  room: null,

  setUserRole: (role) => set({ userRole: role }),
  setCurrentContentIndex: (index) => set((state) => ({
    currentContentIndex: typeof index === 'function'
      ? index(state.currentContentIndex)
      : index,
  })),
  setLastAudioCompleted: (completed) => set({ isLastAudioCompleted: completed }),
  updateParticipant: (participantId, data) => {
    const { participants } = get();
    const currentData = participants.get(participantId) || {
      role: null,
      currentPage: 0,
    };
    participants.set(participantId, { ...currentData, ...data });
    set({ participants: new Map(participants) });
  },
}));
