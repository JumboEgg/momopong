import base64ToBlob from '@/stores/drawing/base64ToBlob';
import useSubAccountStore from '@/stores/subAccountStore';
import { PageInfo } from '@/types/book';

const imgWidth = 1472;
const imgHeight = 832;

// S3에 동화 페이지 이미지 업로드
const uploadImageToS3 = async (dataUrl: string): Promise<string> => {
    try {
      // Convert base64 to blob
      const imageBlob = await base64ToBlob(dataUrl);

      // child token 얻기
      const { accessToken } = useSubAccountStore.getState().childToken;

      if (!accessToken) {
        throw new Error('Failed to get accessToken');
      }

      const presignedResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/book/record-sketch/presigned-url`,
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

      return fileName;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

// 이미지 합성
const pageImageComposer = async (pageInfo: PageInfo, drawingResult: string | null) => {
    if (!pageInfo.hasObject || !drawingResult) {
        return pageInfo.pagePath;
    }
    let dataUrl = '';

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imgWidth;
    tempCanvas.height = imgHeight;

    const pageImg = new Image();
    pageImg.src = pageInfo.pagePath;
    pageImg.onload = () => {
        tempCtx?.drawImage(pageImg, 0, 0, imgWidth, imgHeight);
        const objectImg = new Image();
        objectImg.src = drawingResult ?? '';
        objectImg.onload = () => {
            // 회전 처리
            const radian = (Math.PI / 180) * pageInfo.position.angle; // angle을 radian으로 변환
            tempCtx?.save(); // 현재 상태 저장

            // 객체 이미지의 중앙을 기준으로 회전하기 위해 translate와 rotate 사용
            const objectWidth = pageInfo.position.ratio * 1600;
            const objectHeight = pageInfo.position.ratio * 1000;
            const centerX = pageInfo.position.x + objectWidth / 2;
            const centerY = pageInfo.position.y + objectHeight / 2;

            tempCtx?.translate(centerX, centerY); // 객체 이미지의 중심으로 이동
            tempCtx?.rotate(radian); // 회전

            // 회전된 상태에서 이미지를 그리기 (중심을 기준으로 위치 맞추기)
            tempCtx?.drawImage(
                objectImg,
                -objectWidth / 2, // 이미지의 중심이 (centerX, centerY)로 오도록 위치 조정
                -objectHeight / 2,
                objectWidth,
                objectHeight,
            );

            tempCtx?.restore(); // 상태 복원
        dataUrl = tempCanvas.toDataURL('image/webp');
        };
    };

    // S3에 업로드
    const fileName = await uploadImageToS3(dataUrl);

    return fileName;
};

export default pageImageComposer;
