import { create } from 'zustand';
import useSubAccountStore from '@/stores/subAccountStore';
import { RecordInfo } from '@/types/book';
import uploadStoryAudioToS3 from '@/utils/bookS3/lineAudioUpload';

interface RecordListStore {
  recordList: RecordInfo[];
  addRecord: (audio: Blob) => void;
  clearRecordList: () => void;
  uploadRecord: () => void;
}

const useRecordListStore = create<RecordListStore>()(
    (set, get) => ({
      recordList: [],
      addRecord: async (audioBlob) => {
        try {
          const { presignedUrl, fileName } = await uploadStoryAudioToS3(audioBlob);

          // TODO : API 요구사항에 맞는 데이터 추가
          const data: RecordInfo = {
            path: presignedUrl,
            fileName,
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
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/book/record-audio/save`,
              {
                method: 'POST',
                body: JSON.stringify(get().recordList),
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            set({ recordList: [] });
        } catch (error) {
          console.error('Error uploading page audios:', error);
          throw error;
        }
      },
    }),
);

export const useRecordList = (): RecordListStore => useRecordListStore();
