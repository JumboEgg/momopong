// src/components/ImageUpload.tsx
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
          shape="circle"
          border
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
        <button
          type="button"
          aria-label="프로필 이미지 업로드" // 웹 접근성 관련 속성(스크린 리더가 읽어주는 text)
          className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 012-2h8a2 2 0 012 2v4h-3.5c-.83 0-1.5.67-1.5 1.5v.5H9v-.5C9 7.67 8.33 7 7.5 7H4V3zm9 6V4H7v5h1.5a.5.5 0 01.5.5V11h2v-1.5a.5.5 0 01.5-.5H16zm-4 6v-3H8v3h1zm3 0v-3h-2v3h2zm3-3h-2v3h1a1 1 0 001-1v-2zm-7 3H6a1 1 0 01-1-1v-2h2v3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
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
