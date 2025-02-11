import { RecordingData, StoryMode } from '@/components/stories/types/story';
import { create } from 'zustand';

// Drawing 상태 관리 스토어
interface StoryStore {
  mode: StoryMode | null;
  setMode: (m: StoryMode | null) => void;
  storyId: string | null;
  setStoryId: (id: string | null) => void;
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  recordings: Map<number, RecordingData>;
  addRecording: (idx: number, record: RecordingData) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
}

// Zustand 상태 훅 생성
const useStoryStore = create<StoryStore>((set, get) => ({
  mode: null,
  setMode: (m) => set({ mode: m }),

  storyId: null,
  setStoryId: (id) => set({ storyId: id }),

  currentIndex: 0,
  setCurrentIndex: (idx) => set({ currentIndex: idx }),

  recordings: new Map(),
  addRecording: (idx, record) => set((state) => {
    const newMap = new Map(state.recordings);
    newMap.set(idx, record);
    return { recordings: newMap };
  }),

  audioEnabled: true,
  toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),
}));

// Zustand에서 상태를 가져오는 커스텀 훅
export const useStory = (): StoryStore => useStoryStore();
