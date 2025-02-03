import { DrawingMode } from '@/components/drawing/types/drawing';
import { create } from 'zustand';

export interface DrawingData {
  title: string;
  date: number;
  src: string;
}

// Drawing 상태 관리 스토어
interface DrawingStore {
  mode: DrawingMode | null;
  setMode: (mode: DrawingMode | null) => void;
  friendId: number;
  setFriendId: (id: number) => void;
  friendName: string;
  setFriendName: (name: string) => void;
  templateId: number;
  setTemplateId: (id: number) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  backgroundSrc: string;
  setBackgroundSrc: (src: string) => void;
  outlineSrc: string;
  setOutlineSrc: (src: string) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  isErasing: boolean;
  setIsErasing: (isErasing: boolean) => void;
  imageData: string;
  setImageData: (data: string) => void;
  localDrawingList: DrawingData[];
  addDrawingData: (data: DrawingData) => void;
}

// Zustand 상태 훅 생성
const useDrawingStore = create<DrawingStore>((set) => ({
  mode: null,
  setMode: (mode) => set({ mode }),

  templateId: 0,
  setTemplateId: (id) => set({ templateId: id }),

  templateName: '',
  setTemplateName: (name) => set({ templateName: name }),

  backgroundSrc: '',
  setBackgroundSrc: (src) => set({ backgroundSrc: src }),

  outlineSrc: '',
  setOutlineSrc: (src) => set({ outlineSrc: src }),

  penColor: 'black',
  setPenColor: (color) => set({ penColor: color }),

  isErasing: false,
  setIsErasing: (isErasing) => set({ isErasing }),

  imageData: '',
  setImageData: (data) => set({ imageData: data }),

  localDrawingList: [],
  addDrawingData: (data) => set((state) => ({
    localDrawingList: [...state.localDrawingList, data],
  })),
}));

// Zustand에서 상태를 가져오는 커스텀 훅
export const useDrawing = (): DrawingStore => useDrawingStore();
