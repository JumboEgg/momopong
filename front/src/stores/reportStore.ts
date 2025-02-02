// 아이 활동 내역 조회를 위한 Store
import { create } from 'zustand';

export type ReportType = 'report' | 'activities' | 'crafts';

interface ReportStore {
  childIdx: number;
  setChildIdx: (index: number) => void;
  reportTab: ReportType | null;
  setReportTab: (tab: ReportType | null) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  childIdx: 0,

  setChildIdx: (value) => set(() => ({
    childIdx: value,
  })),

  reportTab: null,

  setReportTab: (value) => set(() => ({
    reportTab: value,
  })),
}));
