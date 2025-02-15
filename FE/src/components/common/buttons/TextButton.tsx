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
  sm: 'px-2 sm:px-2.5 py-0.5 sm:py-1 text-lg sm:text-xl',
  md: 'px-4 sm:px-6 py-1 sm:py-1.5 text-xl sm:text-2xl',
  lg: 'px-6 sm:px-10 py-1 sm:py-1.5 text-2xl sm:text-3xl',
  xl: 'px-8 sm:px-25 py-1.5 sm:py-2 text-3xl sm:text-4xl',
};

// 반응형 border-radius 클래스 정의
const borderRadiusClasses = 'rounded-[2vw] sm:rounded-[1vw]';

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
  const baseClasses = `${borderRadiusClasses} font-[BMJUA] border-2 sm:border-4 transition-colors duration-100 focus:outline-none`;

  const variantClasses: Record<ButtonVariant, string> = {
    white: disabled
      ? 'bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed'
      : `
          ${
            hasFocus
              ? 'bg-tainoi-200 text-black border-white'
              : 'bg-white text-black border-tainoi-300'
          }
          hover:bg-tainoi-200
          active:bg-tainoi-300
          focus:outline-none
        `,
    gray: disabled
      ? 'bg-gray-200 text-zinc-400 border-gray-300 cursor-not-allowed'
      : `
          bg-gray-300 border-gray-300 text-gray-700
          hover:bg-slate-500 hover:border-slate-500 hover:text-white
          active:bg-slate-500 active:border-slate-500 active:text-white
        `,
    blue: disabled
      ? 'bg-gray-200 text-zinc-400 border-gray-300 cursor-not-allowed'
      : `
          bg-blue-ribbon-500 border-blue-ribbon-500 text-white
          hover:bg-blue-ribbon-600 hover:border-blue-ribbon-600 hover:text-white
          active:bg-blue-ribbon-600 active:border-blue-ribbon-600 active:text-white
        `,
    rounded: disabled
      ? 'rounded-full bg-gray-200 border-4 sm:border-8 text-gray-600 border-gray-300 cursor-not-allowed'
      : `
          rounded-full
          bg-broom-400 text-black border-4 sm:border-8 border-tainoi-400
          hover:bg-tainoi-400
          active:bg-tainoi-400
          ${
            hasFocus
              ? 'focus:bg-tainoi-400 focus:outline-none focus:tainoi-400'
              : 'focus:outline-none'
          }
        `,
  };

  const ButtonElement = (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
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
  );

  return ButtonElement;
}

export default TextButton;
