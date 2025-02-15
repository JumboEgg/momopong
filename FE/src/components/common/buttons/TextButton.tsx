export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'white' | 'gray' | 'blue' | 'rounded';
type ButtonType = 'button' | 'submit'; // 추가

interface ButtonProps {
  children: React.ReactNode;
  size: ButtonSize;
  variant: ButtonVariant;
  type?: ButtonType;
  className?: string;
  disabled?: boolean;
  hasFocus?: boolean,
  onClick?: () => void;
}

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xl',
  md: 'px-6 py-1.5 text-2xl',
  lg: 'px-10 py-1.5 text-3xl',
  xl: 'px-25 py-2 text-4xl',
};

function TextButton({
  children,
  size,
  variant,
  type = 'button',
  className,
  disabled,
  onClick,
  hasFocus,
}: ButtonProps): JSX.Element {
  // 기본 폰트 Jua체로 지정. 바꾸고 싶다면 컴포넌트 className에서 font 스타일을 덧씌우세요
  const baseClasses = 'rounded-[1vw] font-[BMJUA] border-4 transition-colors duration-100 focus:outline-none';

  const variantClasses: Record<ButtonVariant, string> = {
    // 아이 화면에서 자주 보일 버튼
    white: `
    ${disabled
      ? 'bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed'
      : `
          ${hasFocus
            ? 'bg-tainoi-200 text-black border-white' // 활성화된 상태
            : 'bg-white text-black border-tainoi-300' // 비활성화된 상태
          }
          hover:bg-tainoi-200
          active:bg-tainoi-300
          focus:outline-none
        `
}
  `,
    // 부모 화면 등에서 자주 보일 버튼
    gray: `
      ${disabled
    ? 'bg-gray-200 text-zinc-400 border-gray-300 cursor-not-allowed'
    : `
      bg-gray-300 border-gray-300 text-gray-700
      hover:bg-slate-500 hover:border-slate-500 hover:text-white
      active:bg-slate-500 active:border-slate-500 active:text-white
      `
}
    `,
    blue: `
      ${disabled
    ? 'bg-gray-200 text-zinc-400 border-gray-300 cursor-not-allowed'
    : `
      bg-blue-ribbon-500 border-blue-ribbon-500 text-white
      hover:bg-blue-ribbon-600 hover:border-blue-ribbon-600 hover:text-white
      active:bg-blue-ribbon-600 active:border-blue-ribbon-600 active:text-white
      `
}
    `,
    rounded: `
    ${disabled
    ? 'rounded-full bg-gray-200 border-8 text-gray-600 border-gray-300 cursor-not-allowed'
    : `
        rounded-full
        bg-broom-400 text-black border-8 border-tainoi-400
        hover:bg-tainoi-400
        active:bg-tainoi-400
        ${hasFocus ? 'focus:bg-tainoi-400 focus:outline-none focus:tainoi-400' : 'focus:outline-none'}
      `
}
  `,
  };

  return (
    <>
      {/* ESLint 규칙에 따라 버튼 타입을 고정된 문자열로 return */}
      {type === 'button' && (
        <button
          type="button"
          className={`
            ${baseClasses}
            ${textSizeClasses[size]}
            ${variantClasses[variant]}
            ${className}
          `}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      )}
      {type === 'submit' && (
        <button
          type="submit"
          className={`
            ${baseClasses}
            ${textSizeClasses[size]}
            ${variantClasses[variant]}
            ${className}
          `}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
}

export default TextButton;
