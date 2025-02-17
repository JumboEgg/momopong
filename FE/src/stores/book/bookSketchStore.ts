import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '../subAccountStore';
import base64ToBlob from '../drawing/base64ToBlob';

// Drawing 상태 관리 스토어
interface BookSketchStore {
  sketch: string | null;
  setSketch: (frameUrl: string) => void; // 그림 결과 S3에 전송
  uploadSketch: (recordId: number) => void; // 자신의 bookRecordId 전달
}

// TODO : 그림 여러 개 사용 시 리스트로 변경
// Zustand 상태 훅 생성
const useBookSketchStore = create<BookSketchStore>()(
  persist(
    (set, get) => ({
        sketch: null,
        setSketch: (frameUrl) => set({ sketch: frameUrl }),
        uploadSketch: async (recordId) => {
        try {
            if (!get().sketch) {
                console.error('Cannot find sketch url');
                return;
            }

            const imageBlob = await base64ToBlob(get().sketch ?? '');
            // child token 얻기
            const { accessToken } = useSubAccountStore.getState().childToken;

            if (!accessToken) {
              throw new Error('Failed to get accessToken');
            }

            const presignedResponse = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/book/record-sketch/presigned-url`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!presignedResponse.ok) {
              throw new Error(`Upload failed: ${presignedResponse.status}`);
            }

            const { presignedUrl, fileName } = await presignedResponse.json();

            const uploadToS3Response = await fetch(presignedUrl, {
                method: 'PUT',
                body: imageBlob,
                headers: {
                    'Content-Type': 'image/webp',
                },
            });

            if (!uploadToS3Response.ok) {
                throw new Error(`Failed to upload to S3: ${uploadToS3Response.status}`);
            }

            const data = {
                bookRecordPageId: recordId,
                bookRecordSketchPath: fileName,
            };

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/book/record-sketch/save`,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status}`);
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
      },
    }),
    {
      name: 'booksketch-storage',
      partialize: (state) => ({
        sketch: state.sketch,
      }),
    },
  ),
);

// Zustand에서 상태를 가져오는 커스텀 훅
export const useBookSketch = (): BookSketchStore => useBookSketchStore();
