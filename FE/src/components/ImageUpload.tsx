import { useRef, useState } from 'react';
import axios from 'axios';
import ProfileImage from '@/components/common/ProfileImage';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (fileName: string) => void;
}

function ImageUpload({ currentImage, onImageChange }: ImageUploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const processImage = async (file: File): Promise<Blob> => new Promise((resolve, reject) => {
    const rawImage = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('2d context not supported'));
      return;
    }

    rawImage.onload = () => {
      let { width, height } = rawImage;
      const MAX_WIDTH = 1024;
      const MAX_HEIGHT = 1024;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }
      } else if (height > MAX_HEIGHT) {
        width = Math.round(width * (MAX_HEIGHT / height));
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(rawImage, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            URL.revokeObjectURL(rawImage.src);
            resolve(blob);
          } else {
            reject(new Error('WebP 변환 실패'));
          }
        },
        'image/webp',
        0.8,
      );
    };

    rawImage.onerror = () => {
      URL.revokeObjectURL(rawImage.src);
      reject(new Error('이미지 로드 실패'));
    };

    rawImage.src = URL.createObjectURL(file);
  });

  const uploadToS3 = async (file: File) => {
    try {
      setIsUploading(true);

      // 1. Get presigned URL
      const { data: { presignedUrl, fileName } } = await axios.get(
        '/api/children/presigned-url',
      );

      // 2. image ->  WebP
      const processedImage = await processImage(file);

      // 3. S3로 업로드
      await axios.put(presignedUrl, processedImage, {
        headers: {
          'Content-Type': 'image/webp',
        },
      });

      // 4. Return the fileName for profile update
      onImageChange(fileName);
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    try {
      await uploadToS3(file);
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ProfileImage
          src={currentImage}
          alt="프로필 이미지"
          size="lg"
          shape="square"
          border
          className={`cursor-pointer ${isUploading ? 'opacity-50' : ''}`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        />
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <p className="mt-2 text-sm text-gray-500">
        {isUploading ? '업로드 중...' : '이미지를 클릭하여 업로드하세요'}
      </p>
    </div>
  );
}

export default ImageUpload;
