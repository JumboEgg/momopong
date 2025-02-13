import useSubAccountStore from '@/stores/subAccountStore';

interface audioS3 {
    presignedUrl: string;
    fileName: string;
}

interface UploadPageAudiosToS3Props {
    audioDataList: audioS3[];
}

// TODO : 오디오 업로드 로직 완료 및 테스트
/*
* Book Audio 업로드 순서
1. 각 문장마다 lineAudioUpload로 업로드
2. 업로드 후 얻은 presignedUrl, fileName을 state에 list로 저장
3. 페이지가 끝날 때 list를 서버로 전송
4. list 초기화
*/
const uploadLetterToS3 = async ({ audioDataList }: UploadPageAudiosToS3Props) => {
    try {
        const { accessToken } = useSubAccountStore.getState().childToken;
        if (!accessToken) {
            throw new Error('Failed to get accessToken');
        }

        const child = useSubAccountStore.getState().selectedAccount;

        if (!child) {
        throw new Error('Failed to get child');
        }

        const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/book/record-audio/save`,
            {
                method: 'POST',
                body: JSON.stringify(audioDataList),
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        console.log('letter uploaded');
    } catch (error) {
        throw new Error('Failed to upload letter');
    }
};

export default uploadLetterToS3;
