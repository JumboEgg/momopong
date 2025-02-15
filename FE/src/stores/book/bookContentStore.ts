import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '@/stores/subAccountStore';
import { BookContentInfo } from '@/types/book';

/**
 * 책 컨텐츠 상태를 관리하는 Zustand 인터페이스
 */
interface BookContentStore {
  bookContent: BookContentInfo | null; // 현재 선택된 책의 내용 (초기값: null)
  setBookContent: (id: number) => void; // 특정 책을 불러오는 함수
}

/**
 * Zustand 상태 관리 스토어
 * - `persist` 미들웨어를 적용하여 상태를 로컬 스토리지에 저장
 */
const useBookContentStore = create<BookContentStore>()(
  persist(
    (set) => ({
      bookContent: null, // 초기 책 내용은 null

      /**
       * 특정 책(bookId)의 데이터를 백엔드에서 가져와 상태에 저장하는 함수
       * @param {number} bookId - 불러올 책의 ID
       */
      setBookContent: async (bookId) => {
        try {
          // 현재 사용자의 액세스 토큰 가져오기
          const { accessToken } = useSubAccountStore.getState().childToken;

          // 백엔드 API에서 책 정보 요청
          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/${bookId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`, // 인증 토큰 포함
              },
            },
          );

          // 요청 실패 시 에러 발생
          if (!response.ok) {
            throw new Error(`Loading failed: ${response.status}`);
          }

          // JSON 데이터 파싱
          const data = await response.json();

          console.log('📖 불러온 책 데이터:', data);

          // Zustand 상태 업데이트 (책 컨텐츠 저장)
          set({ bookContent: data });

        } catch (error) {
          console.error('❌ 책 데이터 로드 오류:', error);
          throw error; // 에러 발생 시 호출한 곳에서 처리하도록 예외 던짐
        }
      },
    }),
    {
      name: 'bookcontent-storage', // 로컬 스토리지 키 설정
      partialize: (state) => ({
        bookContent: state.bookContent, // `bookContent`만 저장
      }),
    },
  ),
);

/**
 * Zustand에서 상태를 가져오는 커스텀 훅
 * - `useBookContent()`을 호출하면 상태를 사용할 수 있음.
 */
export const useBookContent = (): BookContentStore => useBookContentStore();
