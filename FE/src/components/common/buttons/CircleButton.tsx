import React from 'react';

export type CircleButtonSize = 'xs' | 'sm' | 'base' | 'md' | 'lg';
export type CircleButtonVariant = 'default' | 'action' | 'story';

interface CircleButtonBaseProps {
  icon: React.ReactNode;
  size: CircleButtonSize;
  variant: CircleButtonVariant;
  className?: string;
  disabled?: boolean;
  hasFocus?: boolean;
  onClick?: () => void;
}

// 버튼 아래에 추가될 텍스트 인터페이스
interface TextCircleButtonProps extends CircleButtonBaseProps {
  text: string;
}

const sizeClasses: Record<CircleButtonSize, string> = {
  xs: 'w-8 h-8 sm:w-12 sm:h-12 text-base sm:text-lg',
  sm: 'w-14 h-14 sm:w-18 sm:h-18 text-2xl sm:text-3xl',
  base: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl',
  md: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-4xl sm:text-5xl',
  lg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-45 md:h-45 text-5xl sm:text-6xl',
};

const sizeToIconSize: Record<CircleButtonSize, string> = {
  xs: 'xs',
  sm: 'sm',
  base: 'lg',
  md: 'lg',
  lg: 'xl',
};

function IconCircleButton({
  icon,
  size,
  variant,
  className,
  disabled,
  hasFocus,
  onClick,
}: CircleButtonBaseProps) {
  const baseClasses = 'rounded-full border-6 sm:border-8 md:border-10 transition-colors duration-100 focus:outline-none flex items-center justify-center';

  const iconSizeClasses = {
    xs: 'text-base sm:text-lg',
    sm: 'text-2xl sm:text-3xl',
    base: 'text-2xl sm:text-3xl',
    md: 'text-4xl sm:text-5xl',
    lg: 'text-5xl sm:text-6xl',
  };

  const variantClasses: Record<CircleButtonVariant, string> = {
    default: 'bg-broom-200 text-black border-tainoi-300 hover:bg-tainoi-400 active:bg-tainoi-400',
    action: `
      ${disabled
    ? 'bg-gray-200 text-gray-500 border-gray-400 cursor-not-allowed'
    : 'bg-broom-400 text-black border-tainoi-400 hover:bg-tainoi-400 active:bg-tainoi-400'
}
    `,
    story: `
      ${disabled
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    : `bg-broom-400 text-tainoi-500 border-2 border-tainoi-400 
    hover:bg-tainoi-500 hover:text-broom-400 
    active:bg-tainoi-500 active:text-broom-400 
    ${hasFocus ? 'focus:bg-tainoi-500 focus:text-broom-400 border-broom-200 text-broom-400' : 'border-tainoi-300'}`
}
    `,
  };
  return (
    <button
      type="button"
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        flex items-center justify-center
      `}
      disabled={disabled}
      onClick={onClick}
    >
      <div className={`
        ${iconSizeClasses[size]}
        flex items-center justify-center w-full h-full
      `}
      >
        {React.cloneElement(icon as React.ReactElement, {
          size: sizeToIconSize[size],
          className: 'flex-shrink-0', // 아이콘이 축소되지 않도록
        })}
      </div>
    </button>
  );
}

function TextCircleButton({
  text,
  icon,
  size = 'md',
  variant = 'action',
  className = '',
  disabled = false,
  hasFocus = false,
  onClick,
}: TextCircleButtonProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
      <IconCircleButton
        icon={icon}
        size={size}
        variant={variant}
        className={className}
        disabled={disabled}
        hasFocus={hasFocus}
        onClick={onClick}
      />
      <span className="
        font-[BMJUA]
        text-sm sm:text-md md:text-lg
        relative
        -mt-2 sm:-mt-3 md:-mt-3.5
      "
      >
        {/* 바깥쪽 테두리용 텍스트 - 두께도 반응형으로 */}
        <span className="
          absolute
          inset-0
          text-transparent
          [-webkit-text-stroke:4px_black]
          sm:[-webkit-text-stroke:6px_black]
          md:[-webkit-text-stroke:7px_black]
        "
        >
          {text}
        </span>
        {/* 안쪽 컬러 텍스트 */}
        <span className="relative font-medium text-tainoi-400">
          {text}
        </span>
      </span>
    </div>
  );
}

export { IconCircleButton, TextCircleButton };
