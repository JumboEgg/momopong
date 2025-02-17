import { ReactNode } from 'react';

interface NumberButtonProps {
  value: string | ReactNode;
  onClick: () => void;
  variant?: 'default' | 'action';
  className?: string;
}

function NumberButton({
 value, onClick, variant = 'default', className = '',
}: NumberButtonProps) {
  const buttonStyle = {
    default: 'bg-[#FCD34D] hover:bg-[#F5EA4F] hover:border-[#FFC95E]',
    action: 'bg-[#FFB31A] hover:bg-[#FECC68] hover:border-[#FFC95E] hover:text-[#474747]',
  }[variant];

  return (
    <button
      type="button"
      className={`
        rounded-full
        ${buttonStyle}
        border-4 sm:border-6 md:border-8 border-[#FFB31A]
        flex items-center justify-center
        w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] md:w-[75px] md:h-[75px]
        [&.h-screen<412px]:w-[40px] [&.h-screen<412px]:h-[40px]  // 높이가 작을 때 크기 축소
        [&.h-screen<412px]:border-2  // 높이가 작을 때 테두리 축소
        text-lg sm:text-xl md:text-2xl
        [&.h-screen<412px]:text-base  // 높이가 작을 때 폰트 크기 축소
        font-['KCC-Ganpan']
        transition-all duration-200
        ${className}
      `}
      onClick={onClick}
    >
      <span>{value}</span>
    </button>
  );
}

export default NumberButton;
