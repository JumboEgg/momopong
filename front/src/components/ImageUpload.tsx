import { useRef } from 'react';
import ProfileImage from '@/components/common/ProfileImage';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

function ImageUpload({ currentImage, onImageChange }: ImageUploadProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (예: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
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
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <p className="mt-2 text-sm text-gray-500">
        이미지를 클릭하여 업로드하세요
      </p>
    </div>
  );
}

export default ImageUpload;
