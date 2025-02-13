import base64ToBlob from '@/stores/drawing/base64ToBlob';
import useSubAccountStore from '@/stores/subAccountStore';
import { FrameInfo } from '@/types/frame';

// Main upload function
const uploadImageToS3 = async (imageData: FrameInfo): Promise<string> => {
  try {
    // Convert base64 to blob
    const imageBlob = await base64ToBlob(imageData.frameUrl);

    // child token 얻기
    const { accessToken } = useSubAccountStore.getState().childToken;

    if (!accessToken) {
      throw new Error('Failed to get accessToken');
    }

    const presignedResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/frame/presigned-url`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!presignedResponse.ok) {
      throw new Error(`Failed to get presigned URL: ${presignedResponse.status}`);
    }

    const { fileName, presignedUrl } = await presignedResponse.json();

    const uploadToS3Response = await fetch(presignedUrl, {
      method: 'PUT',
      body: imageBlob,
      headers: {
        'Content-Type': 'image/webp',
      },
    });

    if (!uploadToS3Response.ok) {
      throw new Error(`Failed to upload to S3: ${uploadToS3Response.status}`);
    }

    // child id 얻기
    const childId = useSubAccountStore.getState().selectedAccount?.childId;

    if (!childId) {
      throw new Error('Failed to get childId');
    }

    // 2. Upload to S3 using presigned URL
    const uploadResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/frame/${childId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          frameTitle: imageData.frameTitle,
          frameFileName: fileName,
          frameUrl: presignedUrl,
          createdAt: '',
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }

    return fileName;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default uploadImageToS3;
