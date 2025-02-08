import useSubAccountStore from '@/stores/subAccountStore';
import { LetterInfo } from '@/types/letter';

// Main upload function
const loadLettersFromS3 = async (childId: string): Promise<LetterInfo[]> => {
  try {
    // child token 얻기
    const { accessToken } = useSubAccountStore.getState().childToken;

    if (!accessToken) {
      throw new Error('Failed to get accessToken');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profile/${childId}/letter`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
    },
);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default loadLettersFromS3;
