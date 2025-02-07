import { useRef, useState } from 'react';
import ProfileImage from '@/components/common/ProfileImage';
import useSubAccountStore from '@/stores/subAccountStore';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (fileName: string) => void;
  onUploadStart: () => void;
  onUploadComplete: () => void;
  onError: (error: string) => void;
}

function ImageUpload({
  currentImage,
  onImageChange,
  onUploadStart,
  onUploadComplete,
  onError,
}: ImageUploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      onUploadStart();
      setIsUploading(true);

      const fileName = await useSubAccountStore.getState().uploadProfileImage(file);
      onImageChange(fileName);
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.';
      onError(errorMessage);
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
      await uploadImage(file);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
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
