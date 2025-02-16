import { useRef, useState } from 'react';
import ProfileImage from '@/components/common/ProfileImage';
import useSubAccountStore from '@/stores/subAccountStore';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (fileName: string) => void;
  onUploadStart: () => void;
  onUploadComplete: () => void;
  className?: string; // 외부에서 스타일 추가할 수 있도록
}

function ImageUpload({
  currentImage,
  onImageChange,
  onUploadStart,
  onUploadComplete,
  className = '',
}: ImageUploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(currentImage);

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

    // 먼저 로컬 미리보기 설정
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);

    try {
      setIsUploading(true);
      onUploadStart();

      const fileName = await useSubAccountStore.getState().uploadProfileImage(file);
      onImageChange(fileName);
      onUploadComplete();

      // 메모리 해제
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('File upload failed:', error);
      // 업로드 실패시 미리보기 원복
      setLocalPreview(currentImage);
      URL.revokeObjectURL(previewUrl);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* 안내 텍스트를 상단으로 이동하고 선택적으로 표시 */}
      {!currentImage && (
        <p className="
          mb-2
          text-xs sm:text-sm
          text-gray-500
          text-center
        "
        >
          이미지를 클릭하여 업로드하세요
        </p>
      )}

      {/* 이미지 컨테이너가 전체 영역을 차지하도록 수정 */}
      <div className="relative w-full h-full aspect-square">
        <ProfileImage
          src={localPreview}
          alt="프로필 이미지"
          size="responsive"
          shape="square"
          border
          className={`
            w-full h-full 
            object-cover
            rounded-2xl
            cursor-pointer 
            transition-opacity duration-200
            hover:opacity-90
            ${isUploading ? 'opacity-50' : ''}
          `}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        />

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="
              animate-spin rounded-full
              h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10
              border-b-2 border-blue-500
            "
            />
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
    </div>
  );
}

export default ImageUpload;
