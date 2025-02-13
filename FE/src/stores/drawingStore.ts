import { DrawingMode } from '@/components/drawing/types/drawing';
import { FrameInfo } from '@/types/frame';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TemplateData {
  id: number;
  name: string;
  backgroundSrc: string | null;
  outlineSrc: string;
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
  drawingList: FrameInfo[];
  setDrawingData: (data: FrameInfo[]) => void;
}

// Zustand 상태 훅 생성
const useDrawingStore = create<DrawingStore>()(
  persist(
    (set) => ({
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

      drawingList: [],
      setDrawingData: (data) => {
        set({ drawingList: data });
        // console.log('setDrawingData on Store: ', data);
        // console.log('setDrawingData on Store: ', get().drawingList);
      },
    }),
    {
      name: 'drawing-storage',
      partialize: (state) => Object.fromEntries(
        // TODO : 새로고침 시 페이지 생성 시 초기화 설정 때문에 의미가 없다
        // 개선 방안 고려
        Object.entries(state)
          .filter(([key]) => ['mode', 'templateId', 'imageData', 'localDrawingList']
            .includes(key)),
      ),
    },
  ),
);

// Zustand에서 상태를 가져오는 커스텀 훅
export const useDrawing = (): DrawingStore => useDrawingStore();
