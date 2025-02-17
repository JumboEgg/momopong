import { create } from 'zustand';
import useSubAccountStore from '@/stores/subAccountStore';
import { PageInfo, PageRecordData } from '@/types/book';
import uploadStoryAudioToS3 from '@/utils/bookS3/pageAudioS3Upload';
import { getAudioSrcPath, getImageSrcPath } from '@/utils/bookS3/s3PathTrimmer';

interface RecordListStore {
  recordList: PageRecordData[];
  addRecord: (pageData: PageRecordData, audio: Blob | null) => void;
  clearRecordList: () => void;
  uploadRecord: () => void;
  drawingResult: string | null;
  setDrawingResult: (src: string) => void; // 그린 이미지 저장. S3 미등록
  pageImage: string | null;
  setPageImage: (pageInfo: PageInfo) => void;
}

const useRecordListStore = create<RecordListStore>()(
    (set, get) => ({
      recordList: [],

      /* narration과 자신의 대사를 table에 저장 */
      addRecord: async (pageData, audioBlob) => {
        try {
          // narration은 기존 S3를 저장
          if (pageData.role === 'narration') {
            const data = pageData;
            [data.audioPath] = getAudioSrcPath(pageData.audioPath);
            set({ recordList: [...get().recordList, pageData] });
            return;
          }

          if (!audioBlob) {
            throw new Error('Audio is not recorded');
          }

          // 본인 대사일 경우에만 audio 정보 저장 시도
          const { fileName } = await uploadStoryAudioToS3(audioBlob);

          const data = pageData;
          data.audioPath = fileName;

            set({ recordList: [...get().recordList, data] });
        } catch (error) {
          console.error('Error uploading audio:', error);
          throw error;
        }
      },
      clearRecordList: () => set({ recordList: [] }),
      uploadRecord: async () => {
        try {
          const { accessToken } = useSubAccountStore.getState().childToken;

          get().recordList.forEach(async (record) => {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/book/record-page/save`,
              {
                method: 'POST',
                body: JSON.stringify(record),
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }
          });

          set({ recordList: [] });
        } catch (error) {
          console.error('Error uploading page audios:', error);
          throw error;
        }
      },
      drawingResult: null,
      setDrawingResult: async (src) => set({ drawingResult: src }),
      pageImage: null,
      setPageImage: async (pageInfo) => {
        if (!pageInfo.hasObject) {
          set({ pageImage: pageInfo.pagePath });
        } else {
          // TODO : 저장된 이미지, 동화 이미지 합성하는 로직 작성
          // 합성 후 S3 업로드
          // 업로드 후 fileName을 pathImage에 저장
          const path = getImageSrcPath(pageInfo.pagePath);
          set({ pageImage: path });
        }
      },
    }),
);

export const useRecordList = (): RecordListStore => useRecordListStore();
