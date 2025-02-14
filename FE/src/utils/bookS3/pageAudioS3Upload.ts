import useSubAccountStore from '@/stores/subAccountStore';

const uploadStoryAudioToS3 = async (audioBlob: Blob) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;
        if (!accessToken) {
            throw new Error('Failed to get accessToken');
        }

        const presignedResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record-page/presigned-url`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );

        if (!presignedResponse.ok) {
            throw new Error(`Failed to get Presigned URL: ${presignedResponse.status}`);
        }

        const { presignedUrl, fileName } = await presignedResponse.json();

        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            body: audioBlob,
            headers: {
                'Content-Type': 'audio/webm',
            },
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload to S3: ${uploadResponse.status}`);
        }

        return { presignedUrl, fileName };
    } catch (error) {
        console.error('S3 upload error: ', error);
        throw error;
    }
};

export default uploadStoryAudioToS3;
