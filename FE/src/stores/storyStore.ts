import { RecordingData, StoryMode } from '@/components/stories/types/story';
import { create } from 'zustand';

/**
 * 동화 진행 상태(Story) 관리 스토어
 */
interface StoryStore {
  mode: StoryMode | null; // 현재 이야기 모드 (낭독 모드, 녹음 모드 등)
  setMode: (m: StoryMode | null) => void; // 이야기 모드 설정 함수

  bookId: number | null; // 현재 진행 중인 동화책 ID (null 허용)
  setBookId: (id: number | null) => void; // 동화책 ID 설정 함수

  currentIndex: number; // 현재 진행 중인 페이지 인덱스 (0부터 시작)
  setCurrentIndex: (idx: number) => void; // 현재 페이지 설정 함수

  recordings: Map<number, RecordingData>; // 페이지별 녹음 데이터 저장
  addRecording: (idx: number, record: RecordingData) => void; // 녹음 데이터 추가 함수

  audioEnabled: boolean; // 오디오 활성화 여부 (true: 소리 재생, false: 무음)
  toggleAudio: () => void; // 오디오 활성/비활성 토글 함수
}

/**
 * Zustand를 이용한 동화 진행 상태 스토어
 */
const useStoryStore = create<StoryStore>((set, get) => ({
  mode: null, // 초기 이야기 모드 없음
  setMode: (m) => set({ mode: m }), // 이야기 모드 설정

  bookId: null, // 초기에는 책 ID 없음
  setBookId: (id) => set({ bookId: id }), // 책 ID 설정

  currentIndex: 0, // 첫 번째 페이지에서 시작
  setCurrentIndex: (idx) => set({ currentIndex: idx }), // 페이지 변경 함수

  recordings: new Map(), // 초기 녹음 데이터 없음
  /**
   * ✅ 특정 페이지의 녹음 데이터 저장 함수
   * @param idx - 페이지 번호
   * @param record - 녹음 데이터 (`RecordingData` 타입)
   */
  addRecording: (idx, record) => set((state) => {
    const newMap = new Map(state.recordings); // 기존 맵 복사
    newMap.set(idx, record); // 새로운 데이터 추가
    return { recordings: newMap };
  }),

  audioEnabled: true, // 기본적으로 오디오 활성화 상태
  /**
   * ✅ 오디오 활성/비활성 상태 토글
   * - 사용자가 소리를 끄거나 켤 수 있음.
   */
  toggleAudio: () => set({ audioEnabled: !get().audioEnabled }),
}));

/**
 * Zustand에서 상태를 가져오는 커스텀 훅
 * - `useStory()`을 호출하면 상태를 사용할 수 있음.
 */
export const useStory = (): StoryStore => useStoryStore();
