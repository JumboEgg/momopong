import useSubAccountStore from '@/stores/subAccountStore';
import { FrameInfo } from '@/types/frame';

// Helper function to convert base64 to blob
// const base64ToBlob = async (base64String: string): Promise<Blob> => {
//   // Extract actual base64 data (remove data URL prefix if present)
//   const base64Data = base64String.split(',')[1] || base64String;

//   // Convert base64 to byte array
//   const byteCharacters = atob(base64Data);
//   const byteArrays = [];

//   for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//     const slice = byteCharacters.slice(offset, offset + 512);
//     const byteNumbers = new Array(slice.length);

//     // eslint-disable-next-line no-plusplus
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }

//   return new Blob(byteArrays, { type: 'image/webp' });
// };

// Main upload function
const uploadImageToS3 = async (imageData: FrameInfo): Promise<string> => {
  try {
    // Convert base64 to blob
    // -> JSON으로 전송 시 base64로 전송
    // const imageBlob = await base64ToBlob(imageData.src);

    // child token 얻기
    const { accessToken } = useSubAccountStore.getState().childToken;

    if (!accessToken) {
      throw new Error('Failed to get accessToken');
    }

    const presignedResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/draw/presigned-url`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log(presignedResponse);

    if (!presignedResponse.ok) {
      throw new Error(`Failed to get presigned URL: ${presignedResponse.status}`);
    }

    const { fileName } = await presignedResponse.json();

    // child id 얻기
    const childId = useSubAccountStore.getState().selectedAccount?.childId;

    if (!childId) {
      throw new Error('Failed to get childId');
    }

    // 2. Upload to S3 using presigned URL
    const uploadResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/draw/${childId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          frameTitle: imageData.frameTitle,
          frameFileName: fileName,
          frameUrl: imageData.frameUrl,
          createdAt: '',
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
    },
);

    console.log(uploadResponse);

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
