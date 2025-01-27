type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'white' | 'gray' | 'circle';

interface ButtonProps {
  children: React.ReactNode;
  size: ButtonSize; // Make optional in interface
  variant: ButtonVariant;
  className: string;
  disabled: boolean;
  onClick: () => void;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-2xl',
  md: 'px-15 py-2 text-3xl',
  lg: 'px-30 py-2.5 text-4xl',
};

function TextButton({
  children,
  size = 'md',
  variant = 'white',
  className = '',
  disabled = false,
  onClick,
}: ButtonProps): JSX.Element {
  const baseClasses = 'rounded-[1vw] font-[BMJUA] border-4 transition-colors duration-100 focus:outline-none';

  const variantClasses: Record<ButtonVariant, string> = {
    white: `
      ${disabled
    ? 'bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed'
    : `
          bg-white text-[#111827] border-4 border-tainoi-300
          hover:bg-tainoi-200
          active:bg-tainoi-300
          focus:bg-tainoi-300
          focus:outline-none
        `
}
    `,
    gray: `
      ${disabled
    ? 'bg-gray-200 text-zinc-400 border-gray-300 cursor-not-allowed'
    : `
          bg-gray-200 border-gray-200 text-gray-700
          hover:bg-blue-ribbon-500 hover:border-blue-ribbon-500 hover:text-white
          active:bg-blue-ribbon-600
          focus:bg-bg-blue-ribbon-600 focus:text-white
          focus:outline-none
        `
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
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default TextButton;
