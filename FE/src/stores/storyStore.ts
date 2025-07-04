import { RecordingData, StoryMode } from '@/components/stories/types/story';
import { create } from 'zustand';

// story 상태 관리 스토어
interface StoryStore {
  mode: StoryMode | null;
  setMode: (m: StoryMode | null) => void;
  bookId: number | null; // storyId -> bookId, null 허용
  setBookId: (id: number | null) => void // 타입 수정
  currentIndex: number;
  setCurrentIndex: (idx: number) => void;
  currentAudioIndex: number;
  setCurrentAudioIndex: (idx: number) => void;
  recordings: Map<number, RecordingData>;
  addRecording: (idx: number, record: RecordingData) => void;
  audioEnabled: boolean;
  toggleAudio: () => void;
  bookRecordId: number | null;
  setBookRecordId: (id: number | null) => void;
}

// Zustand 상태 훅 생성
const useStoryStore = create<StoryStore>((set, get) => ({
  mode: null,
  setMode: (m) => set({ mode: m }),

  bookId: null, // storyId -> bookId
  setBookId: (id) => set({ bookId: id }), // 구현 수정

  currentIndex: 0,
  setCurrentIndex: (idx) => set({ currentIndex: idx }),

  currentAudioIndex: 0,
  setCurrentAudioIndex: (idx) => set({ currentAudioIndex: idx }),

  recordings: new Map(),
  addRecording: (idx, record) => set((state) => {
    const newMap = new Map(state.recordings);
    newMap.set(idx, record);
    return { recordings: newMap };
  }),

  audioEnabled: true,
  toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),

  bookRecordId: null,
  setBookRecordId: (id) => set({ bookRecordId: id }),
}));

// Zustand에서 상태를 가져오는 커스텀 훅
export const useStory = (): StoryStore => useStoryStore();
