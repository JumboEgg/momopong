import { DrawingMode } from '@/components/drawing/types/drawing';
import { DrawingParticipationRecordData, SketchInfo } from '@/types/sketch';
import makeDrawingRecord from '@/utils/drawingS3/drawingRecordCreate';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Drawing 상태 관리 스토어
interface DrawingStore {
  mode: DrawingMode | null;
  setMode: (mode: DrawingMode | null) => void;
  template: SketchInfo | null;
  setTemplate: (data : SketchInfo | null) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  isErasing: boolean;
  setIsErasing: (isErasing: boolean) => void;
  imageData: string;
  setImageData: (data: string) => void;
  sessionId: number | null;
  setSessionId: (data: DrawingParticipationRecordData) => void;
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

      sessionId: null,
      setSessionId: async (data) => {
        const id = await makeDrawingRecord(data);
        set({ sessionId: id });
      },
    }),
    {
      name: 'drawing-storage',
      partialize: (state) => Object.fromEntries(
        // TODO : 새로고침 시 페이지 생성 시 초기화 설정 때문에 의미가 없다
        // 개선 방안 고려
        Object.entries(state)
          .filter(([key]) => ['mode', 'template', 'imageData', 'sessionId']
            .includes(key)),
      ),
    },
  ),
);

// Zustand에서 상태를 가져오는 커스텀 훅
export const useDrawing = (): DrawingStore => useDrawingStore();
