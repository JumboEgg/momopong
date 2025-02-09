import { useState, useEffect } from 'react';

export type ProfileImgSize = 'sm' | 'md' | 'lg' | 'xl';
type ProfileImgShape = 'circle' | 'square';

interface ProfileImgProps {
  src: string | undefined;
  alt?: string;
  size?: ProfileImgSize;
  shape?: ProfileImgShape;
  border?: boolean;
  className?: string;
  onClick?: () => void;
}

function ProfileImage({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  border = false,
  className = '',
  onClick,
}: ProfileImgProps): JSX.Element {
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/images/default-profile.jpg';
  const imageSrc = imageError || !src ? defaultImage : src;

  // src가 변경될 때마다 error 상태 초기화
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const sizeClasses = {
    sm: 'w-15 h-15', // 친구목록
    md: 'w-20 h-20', // 프로필카드 이동
    lg: 'w-65 h-65', // 서브계정 그리드
    xl: 'w-100 h-100', // 프로필카드, 서브계정 가입
  } as const;

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  } as const;

  const borderClasses = border ? 'border-2 border-gray-200' : '';
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      // onClick 속성 포함 여부에 따라 button 또는 div가 렌더링되도록 함
      type={onClick ? 'button' : undefined}
      className={`relative overflow-hidden ${sizeClasses[size]} ${shapeClasses[shape]} ${borderClasses} ${className}`}
      onClick={onClick}
      aria-label={onClick ? alt : undefined}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </Component>
  );
}
export default ProfileImage;
