import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SketchInfo } from '@/types/sketch';
import useSubAccountStore from '@/stores/subAccountStore';

interface SketchListStore {
  sketchList: SketchInfo[];
  setSketchList: () => void;
}

const useSketchListStore = create<SketchListStore>()(
  persist(
    (set) => ({
      sketchList: [],
      setSketchList: async () => {
        try {
          const { accessToken } = useSubAccountStore.getState().childToken;
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/sketch`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();

            set({ sketchList: data });
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      },
    }),
    {
      name: 'sketchlist-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state)
          .filter(([key]) => ['sketchList']
            .includes(key)),
      ),
    },
  ),
);

export const useSketchList = (): SketchListStore => useSketchListStore();
