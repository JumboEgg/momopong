type ProfileImgSize = 'sm' | 'md' | 'lg' | 'xl';
type ProfileImgShape = 'circle' | 'square';

interface ProfileImgProps {
  src: string;
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
  const sizeClasses = {
    sm: 'w-15 h-15',
    md: 'w-20 h-20',
    lg: 'w-50 h-50',
    xl: 'w-100 h-100',
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
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </Component>
  );
}
export default ProfileImage;
