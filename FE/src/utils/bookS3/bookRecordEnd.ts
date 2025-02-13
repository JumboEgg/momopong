import useSubAccountStore from '@/stores/subAccountStore';

const endBookRecordSession = async () => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        // TODO : roleStore에 저장된 데이터로 교체
        const bookRecordId = 5;
        const data = {
            recordId: bookRecordId,
        };

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record/complete/${bookRecordId}`,
            {
                method: 'POST',
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default endBookRecordSession;
