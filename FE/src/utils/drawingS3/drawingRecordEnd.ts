import useSubAccountStore from '@/stores/subAccountStore';

const endDrawingSession = async (sessionId: number) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/sketch/record/complete/${sessionId}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Error ending sketch record: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default endDrawingSession;
