import useSubAccountStore from '@/stores/subAccountStore';
import { LetterInfo } from '@/types/letter';

interface UploadAudioToS3Props {
    accessToken: string;
    audioBlob: Blob;
}

interface UploadLetterToS3Props {
    letter: LetterInfo;
    audioBlob: Blob;
}

const uploadAudioToS3 = async ({ accessToken, audioBlob }: UploadAudioToS3Props) => {
    try {
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
            method: 'POST',
            body: audioBlob,
            headers: {
                'Content-Type': 'audio/wav',
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

const uploadLetterToS3 = async ({ letter, audioBlob }: UploadLetterToS3Props) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;
        if (!accessToken) {
            throw new Error('Failed to get accessToken');
        }

        const { presignedUrl, fileName } = await uploadAudioToS3({ accessToken, audioBlob });
        // const content = getContentFromAudio(audioBlob);

        const data: LetterInfo = {
            bookTitle: letter.bookTitle,
            role: letter.role,
            childName: letter.childName,
            content: letter.content,
            letterFileName: fileName,
            letterUrl: presignedUrl,
            reply: '',
            createdAt: '',
        };

        const childId = useSubAccountStore.getState().selectedAccount?.childId;

        if (!childId) {
        throw new Error('Failed to get childId');
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/letter/gpt/${childId}`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }
    } catch (error) {
        throw new Error('Failed to upload letter');
    }
};

export default uploadLetterToS3;
