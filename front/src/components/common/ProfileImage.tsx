type ProfileImgSize = 'sm' | 'md' | 'lg' | 'xl';
type ProfileImgShape = 'circle' | 'square';

interface ProfileImgProps {
  src: string;
  alt?: string;
  size?: ProfileImgSize;
  shape?: ProfileImgShape;
  border?: boolean;
  className?: string;
}

function ProfileImage({
  src,
  alt,
  size,
  shape,
  border,
  className,
}: ProfileImgProps): JSX.Element {
  const sizeClasses = {
    sm: 'w-15 h-15', // 친구목록
    md: 'w-20 h-20', // 프로필 버튼
    lg: 'w-50 h-50', // 서브계정 선택페이지
    xl: 'w-100 h-100', // 프로필카드
  } as const;

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  } as const;

  const borderClasses = border ? 'border-2 border-gray-200' : '';

  return (
    <div
      className={`relative overflow-hidden ${sizeClasses[size]} ${shapeClasses[shape]} ${borderClasses} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default ProfileImage;
