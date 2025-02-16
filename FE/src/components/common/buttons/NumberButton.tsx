import { ReactNode } from 'react';

interface NumberButtonProps {
  value: string | ReactNode;
  onClick: () => void;
  variant?: 'default' | 'action';
}

function NumberButton({ value, onClick, variant = 'default' }: NumberButtonProps) {
  // variant에 따른 스타일 분기
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
        w-[50px] h-[50px] 
        sm:w-[65px] sm:h-[65px] 
        md:w-[75px] md:h-[75px]
        transition-all duration-200
        font-['KCC-Ganpan']
        text-lg sm:text-xl md:text-2xl lg:text-3xl
      `}
      onClick={onClick}
    >
      <span className="transform transition-transform active:scale-95">
        {value}
      </span>
    </button>
  );
}

export default NumberButton;
