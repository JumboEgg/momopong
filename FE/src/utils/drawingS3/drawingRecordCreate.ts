import useSubAccountStore from '@/stores/subAccountStore';
import { DrawingParticipationRecordData, DrawingParticipationRecordInfo } from '@/types/sketch';

const makeDrawingRecord = async (recordData: DrawingParticipationRecordData) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/sketch/record/save`,
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
            throw new Error(`Sketch record table creation failed: ${response.status}`);
        }

        const data: DrawingParticipationRecordInfo = await response.json();

        return data.sketchParticipationId;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default makeDrawingRecord;
