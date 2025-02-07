import { DrawingMode } from '@/components/drawing/types/drawing';
import { create } from 'zustand';

export interface TemplateData {
  id: number;
  name: string;
  backgroundSrc: string | null;
  outlineSrc: string;
}

export interface DrawingData {
  title: string;
  date: number;
  src: string;
}

// Drawing 상태 관리 스토어
interface DrawingStore {
  mode: DrawingMode | null;
  setMode: (mode: DrawingMode | null) => void;
  template: TemplateData | null;
  setTemplate: (data : TemplateData | null) => void;
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

  template: null,
  setTemplate: (data) => set({ template: data }),

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
