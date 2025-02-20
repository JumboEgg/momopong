import { DrawingMode } from '@/components/drawing/types/drawing';
import { DrawingParticipationRecordData, SketchInfo } from '@/types/sketch';
import makeDrawingRecord from '@/utils/drawingS3/drawingRecordCreate';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DrawingStore {
  mode: DrawingMode | null;
  setMode: (mode: DrawingMode | null) => void;
  template: SketchInfo | null;
  setTemplate: (data : SketchInfo | null) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penWidth: number;
  setPenWidth: (width: number) => void;
  isErasing: boolean;
  setIsErasing: (isErasing: boolean) => void;
  imageData: string;
  setImageData: (data: string) => void;
  sessionId: number | null;
  setSessionId: (data: DrawingParticipationRecordData) => void;
}

const useDrawingStore = create<DrawingStore>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (mode) => set({ mode }),

      template: null,
      setTemplate: (data) => set({ template: data }),

      penColor: 'black',
      setPenColor: (color) => set({ penColor: color }),

      penWidth: 30,
      setPenWidth: (width) => set({ penWidth: width }),

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
        Object.entries(state)
          .filter(([key]) => ['mode', 'template', 'imageData', 'sessionId']
            .includes(key)),
      ),
    },
  ),
);

export const useDrawing = (): DrawingStore => useDrawingStore();
