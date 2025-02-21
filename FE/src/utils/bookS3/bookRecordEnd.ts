import useSubAccountStore from '@/stores/subAccountStore';

const endBookRecordSession = async (bookRecordId: number) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        const data = {
            recordId: bookRecordId,
        };

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/complete/${bookRecordId}`,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'applicaton/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error ending book record: ${response.status}`);
        }

        console.log('book record ended: ', bookRecordId);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default endBookRecordSession;
