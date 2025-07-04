import { create } from 'zustand';
import useSubAccountStore from '@/stores/subAccountStore';
import { PageInfo, PageRecordData } from '@/types/book';
import uploadStoryAudioToS3 from '@/utils/bookS3/pageAudioS3Upload';
import { getAudioSrcPath } from '@/utils/bookS3/s3PathTrimmer';
import pageImageComposer from '@/utils/bookS3/pageImageComposer';

interface RecordListStore {
  recordList: PageRecordData[];
  addRecord: (pageData: PageRecordData, audio: Blob | null) => void;
  clearRecordList: () => void;
  uploadRecord: () => void;
  drawingResult: string | null; // 그린 이미지 저장. S3 미등록
  setDrawingResult: (src: string) => void;
  pageImage: string | null; // 그린 이미지를 동화 페이지와 합성. S3 등록
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
            const path = getAudioSrcPath(pageData.audioPath.split('?')[0]);
            data.audioPath = path;
            data.pagePath = get().pageImage ?? data.pagePath;
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
          data.pagePath = get().pageImage ?? data.pagePath;

            set({ recordList: [...get().recordList, data] });
        } catch (error) {
          console.error('Error uploading audio:', error);
          throw error;
        }
      },
      clearRecordList: () => set({ recordList: [] }),
      uploadRecord: async () => {
        if (get().recordList.length === 0) return;
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
        const fileName = await pageImageComposer(pageInfo, get().drawingResult);
        set({ pageImage: fileName });
      },
    }),
);

export const useRecordList = (): RecordListStore => useRecordListStore();
