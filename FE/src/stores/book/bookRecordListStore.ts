import { create } from 'zustand';
import useSubAccountStore from '@/stores/subAccountStore';
import { PageRecordData } from '@/types/book';
import uploadStoryAudioToS3 from '@/utils/bookS3/pageAudioS3Upload';

interface RecordListStore {
  recordList: PageRecordData[];
  addRecord: (pageData: PageRecordData, audio: Blob) => void;
  clearRecordList: () => void;
  uploadRecord: () => void;
}

const useRecordListStore = create<RecordListStore>()(
    (set, get) => ({
      recordList: [],

      /* narration과 자신의 대사를 table에 저장 */
      addRecord: async (pageData, audioBlob) => {
        try {
          // narration은 기존 S3를 저장
          if (pageData.role === 'narration') {
            set({ recordList: [...get().recordList, pageData] });
            return;
          }

          // 본인 대사일 경우에만 audio 정보 저장 시도
          const { fileName } = await uploadStoryAudioToS3(audioBlob);

          // TODO : roleStore에서 정보 가져오기
          const inviterRecordId = 5;
          const inviteeRecordId = 6;

          const data: PageRecordData = {
            bookRecordId: inviterRecordId,
            partnerBookRecordId: inviteeRecordId,
            bookRecordPageNumber: pageData.bookRecordPageNumber,
            pagePath: pageData.pagePath,
            audioPath: fileName,
            role: pageData.role,
            text: pageData.text,
            audioNumber: pageData.audioNumber,
          };

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
    }),
);

export const useRecordList = (): RecordListStore => useRecordListStore();
