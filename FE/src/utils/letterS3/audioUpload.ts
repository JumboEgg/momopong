import useSubAccountStore from '@/stores/subAccountStore';

interface UploadAudioToS3Props {
    audioBlob: Blob;
}

const uploadAudioToS3 = async ({ audioBlob }: UploadAudioToS3Props) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;
        if (!accessToken) {
            throw new Error('Failed to get accessToken');
        }

        const presignedResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/letter/presigned-url`,
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

export default uploadAudioToS3;
