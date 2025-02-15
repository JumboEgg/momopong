// 아이 활동 내역 조회를 위한 Store
import { ActivityAnalysisInfo, ActivityHistoryInfo } from '@/types/report';
import { create } from 'zustand';
import { LetterInfo } from '@/types/letter';
import { FrameInfo } from '@/types/frame';
import useAuthStore from './authStore';

export type ReportType = 'report' | 'activities' | 'crafts';

interface ReportStore {
  childIdx: number;
  setChildIdx: (index: number) => void;
  reportTab: ReportType | null;
  setReportTab: (tab: ReportType | null) => void;

  analysis: ActivityAnalysisInfo | null;
  setAnalysis: (id: number) => void;
  history: ActivityHistoryInfo[];
  setHistory: (id: number) => void;
  sketches: FrameInfo[];
  setSketches: (id: number) => void;
  letters: LetterInfo[];
  setLetters: (id: number) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  childIdx: 0,

  setChildIdx: (value) => set(() => ({
    childIdx: value,
  })),

  reportTab: 'report',

  setReportTab: (value) => set(() => ({
    reportTab: value,
  })),

  analysis: null,
  setAnalysis: async (childId) => {
    try {
      const { accessToken } = useAuthStore.getState();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/report/activity-analysis/${childId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Loading Activity failed: ${response.status}`);
        }

        const data = await response.json();

        set({ analysis: data });
    } catch (error) {
      console.error('Error loading activity:', error);
      throw error;
    }
  },

  history: [],
  setHistory: async (childId) => {
    try {
      const { accessToken } = useAuthStore.getState();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/report/activity-history/${childId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Loading History failed: ${response.status}`);
        }

        const data = await response.json();

        set({ history: data });
    } catch (error) {
      console.error('Error loading history:', error);
      throw error;
    }
  },

  sketches: [],
  setSketches: async (childId) => {
    try {
      const { accessToken } = useAuthStore.getState();

      if (!accessToken) {
        throw new Error('Failed to get accessToken');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/${childId}/frame`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Loading failed: ${response.status}`);
      }

      const data = await response.json();

      set({ sketches: data });
    } catch (error) {
      console.error('Error loading sketches:', error);
      throw error;
    }
  },

  letters: [],
  setLetters: async (childId) => {
    try {
      const { accessToken } = useAuthStore.getState();

      if (!accessToken) {
        throw new Error('Failed to get accessToken');
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/${childId}/letter`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Loading failed: ${response.status}`);
      }

      const data = await response.json();

      set({ letters: data });
    } catch (error) {
      console.error('Error loading letters:', error);
      throw error;
    }
  },
}));
