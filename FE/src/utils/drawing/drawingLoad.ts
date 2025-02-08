import useSubAccountStore from '@/stores/subAccountStore';
import { FrameInfo } from '@/types/frame';

// 이미지 로드
// const loadImages = async (data: FrameInfo[], accessToken: string) => {
//   const imageList = await Promise.all(
//     data.map(async (frame) => {
//     try {
//         const response = await fetch(frame.frameFileName, {
//           method: 'GET',
//           headers: {
//             Accept: 'image/webp,image/*;q=0.8,*/*;q=0.5',
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to load image');
//         }

//         const imageUrl = response.url;
//         console.log(imageUrl);
//         const result: FrameInfo = {
//           frameTitle: frame.frameTitle,
//           frameFileName: frame.frameFileName,
//           frameUrl: imageUrl,
//           createdAt: frame.createdAt,
//         };

//         return result;
//       } catch (error) {
//         console.error(`Error loading image for ${frame.frameTitle}:`, error);
//         const emptyImageData: FrameInfo = {
//           frameTitle: frame.frameTitle,
//           frameFileName: frame.frameFileName,
//           frameUrl: '',
//           createdAt: frame.createdAt,
//         };
//         return emptyImageData;
//       }
//   }),
// );
//   return imageList;
// };

// Main upload function
const loadImagesFromS3 = async (childId: string): Promise<FrameInfo[]> => {
  try {
    // child token 얻기
    const { accessToken } = useSubAccountStore.getState().childToken;

    if (!accessToken) {
      throw new Error('Failed to get accessToken');
    }

    // 2. Upload to S3 using presigned URL
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/profile/${childId}/frame`,
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

    // const result = await loadImages(data, accessToken);

    // return result;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export default loadImagesFromS3;
