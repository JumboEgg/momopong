type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type ButtonVariant = 'white' | 'gray' | 'blue' | 'rounded';

interface ButtonProps {
  children: React.ReactNode;
  size: ButtonSize; // Make optional in interface
  variant: ButtonVariant;
  className: string;
  disabled: boolean;
  hasFocus: boolean,
  onClick: () => void;
}

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xl',
  md: 'px-10 py-1.5 text-2xl',
  lg: 'px-18 py-1.5 text-3xl',
  xl: 'px-25 py-2 text-4xl',
};

function TextButton({
  children,
  size,
  variant,
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
        bg-white text-black border-tainoi-300
        hover:bg-tainoi-200
        active:bg-tainoi-300
        ${hasFocus ? 'focus:bg-tainoi-300 focus:outline-none focus:border-white' : 'focus:outline-none'}
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
  );
}

export default TextButton;
