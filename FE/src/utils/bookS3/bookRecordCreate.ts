import useSubAccountStore from '@/stores/subAccountStore';
import { BookParticiPationRecordData, BookParticipationRecordInfo } from '@/types/book';

const makeBookRecord = async (recordData: BookParticiPationRecordData) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/save`,
            {
                method: 'POST',
                body: JSON.stringify(recordData),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Book record table creation failed: ${response.status}`);
        }

        const data: BookParticipationRecordInfo = await response.json();

        return data.bookRecordId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default makeBookRecord;
