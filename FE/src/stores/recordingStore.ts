import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { StoryRole, STORY_ROLES } from './roleStore';

/**
 * 녹음 정보를 위한 인터페이스
 * @interface RecordingInfo
 * @property {number} bookRecordId - 현재 사용자의 녹음 기록 ID
 * @property {number} partnerBookRecordId - 파트너의 녹음 기록 ID
 * @property {number} bookRecordPageNumber - 녹음된 페이지 번호
 * @property {string} pagePath - 페이지 이미지 경로
 * @property {string} audioPath - 녹음 파일의 S3 경로
 * @property {string} role - 녹음자의 역할
 * @property {string} text - 녹음된 텍스트 내용
 * @property {number} audioNumber - 녹음 순서 번호
 */
interface RecordingInfo {
  bookRecordId: number;
  partnerBookRecordId: number;
  bookRecordPageNumber: number;
  pagePath: string;
  audioPath: string;
  role: string;
  text: string;
  audioNumber: number;
}

/**
 * 녹음 상태 관리를 위한 인터페이스
 * @interface RecordingState
 */
interface RecordingState {
  // 각 역할별로 페이지 번호를 키로 하는 녹음 정보 맵
  role1Recordings: Map<number, RecordingInfo[]>;
  role2Recordings: Map<number, RecordingInfo[]>;

  // 현재 보고 있는 페이지 번호
  currentPage: number;

  // 각 역할별 고유 녹음 ID (DB 저장 시 필요)
  recordIdRole1: number | null;
  recordIdRole2: number | null;

  // 액션 메서드
  setRecordingInfo: ( // 녹음에 관련된 정보들
    pageNumber: number,
    recordingInfo: Omit<RecordingInfo, 'bookRecordId' | 'partnerBookRecordId'>,
    role: StoryRole
  ) => void;
  updateRecordIds: (role: StoryRole, recordId: number) => void;
  getRecordingsByPage: (pageNumber: number, role: StoryRole) => RecordingInfo[] | undefined;
  setCurrentPage: (pageNumber: number) => void; // 현재 페이지 정보
  clearRecordings: () => void; // 녹음정보 초기화
  getAllRecordings: (role: StoryRole) => Map<number, RecordingInfo[]>; // 모든 녹음정보 조회
}

/**
 * 녹음 정보 관리를 위한 Zustand 스토어
 * localStorage를 통해 상태를 유지하며, Map 구조를 직렬화하여 저장
 */
export const useRecordingStore = create<RecordingState>()(
  persist(
    (set, get) => ({
      // 초기 상태 설정
      role1Recordings: new Map(),
      role2Recordings: new Map(),
      currentPage: 1,
      recordIdRole1: null,
      recordIdRole2: null,

      /**
       * 새로운 녹음 정보를 추가하는 메서드
       * @param pageNumber - 녹음이 속한 페이지 번호
       * @param recordingInfo - 녹음 정보 (bookRecordId와 partnerBookRecordId 제외)
       * @param role - 녹음자의 역할 (PRINCESS 또는 PRINCE)
       */
      setRecordingInfo: (pageNumber, recordingInfo, role) => {
        const state = get();
        const targetMap = role === STORY_ROLES.PRINCESS
          ? state.role1Recordings
          : state.role2Recordings;

        const existingRecordings = targetMap.get(pageNumber) || [];
        const recordId = role === STORY_ROLES.PRINCESS
          ? state.recordIdRole1
          : state.recordIdRole2;

        const newRecording: RecordingInfo = {
          ...recordingInfo,
          bookRecordId: recordId || 0,
          partnerBookRecordId: 0,
        };

        const updatedMap = new Map(targetMap);
        updatedMap.set(pageNumber, [...existingRecordings, newRecording]);

        set(role === STORY_ROLES.PRINCESS
          ? { role1Recordings: updatedMap }
          : { role2Recordings: updatedMap });
      },

      /**
       * 역할별 녹음 ID를 업데이트하는 메서드
       * @param role - 업데이트할 역할
       * @param recordId - 새로운 녹음 ID
       */
      updateRecordIds: (role, recordId) => {
        set(role === STORY_ROLES.PRINCESS
          ? { recordIdRole1: recordId }
          : { recordIdRole2: recordId });
      },

      /**
       * 특정 페이지의 녹음 정보를 조회하는 메서드
       * @param pageNumber - 조회할 페이지 번호
       * @param role - 조회할 역할
       * @returns 해당 페이지의 녹음 정보 배열 또는 undefined
       */
      getRecordingsByPage: (pageNumber, role) => {
        const state = get();
        const targetMap = role === STORY_ROLES.PRINCESS
          ? state.role1Recordings
          : state.role2Recordings;
        return targetMap.get(pageNumber);
      },

      /**
       * 현재 페이지 번호를 설정하는 메서드
       * @param pageNumber - 설정할 페이지 번호
       */
      setCurrentPage: (pageNumber) => {
        set({ currentPage: pageNumber });
      },

      /**
       * 모든 녹음 정보를 초기화하는 메서드
       */
      clearRecordings: () => {
        set({
          role1Recordings: new Map(),
          role2Recordings: new Map(),
          currentPage: 1,
          recordIdRole1: null,
          recordIdRole2: null,
        });
      },

      /**
       * 특정 역할의 모든 녹음 정보를 조회하는 메서드
       * @param role - 조회할 역할
       * @returns 해당 역할의 모든 녹음 정보가 담긴 Map
       */
      getAllRecordings: (role) => {
        const state = get();
        return role === STORY_ROLES.PRINCESS
          ? state.role1Recordings
          : state.role2Recordings;
      },
    }),
    {
      name: 'story-recording-storage',
      storage: createJSONStorage(() => localStorage),
      // partialize: localStorage에 저장하기 전, 데이터 선택 및 가공하는 함수
      partialize: (state: RecordingState) => ({
        ...state,
        role1Recordings: Array.from(state.role1Recordings.entries()),
        role2Recordings: Array.from(state.role2Recordings.entries()),
      }),
      // 페이지 새로고침시 저장된 데이터를 다시 원래 형태로 만들어주는 zustand 라이브러리 내 함수
      onRehydrateStorage: () => (state: RecordingState | undefined, set: any): void => {
          if (!state) return;

          const role1Recordings = new Map(state.role1Recordings);
          const role2Recordings = new Map(state.role2Recordings);

          set({
            ...state,
            role1Recordings,
            role2Recordings,
          });
        },
    },
  ),
);
