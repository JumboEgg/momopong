import { ReactNode } from 'react';

interface NumberButtonProps {
  value: string | ReactNode;
  onClick: () => void;
  variant: 'defualt' | 'action';
}

function NumberButton({ value, onClick, variant = 'default' }: NumberButtonProps) {
  // variant에 따른 스타일 분기
  const buttonStyle = {
    default: 'bg-[#FCD34D] hover:bg-[#F5EA4F] hover:border-[#FFC95E] ',
    action: 'bg-[#FFB31A] hover:bg-[#FECC68] hover:border-[#FFC95E] hover:text-[#474747]', // delete, enter 색 다르게
  }[variant];

  return (
    <button
      type="button"
      className={`rounded-full
        ${buttonStyle}
        border-8 border-[#FFB31A]
        flex items-center justify-center
        min-w-[75px] min-h-[75px]
        font-['KCC-Ganpan']`}
      style={{ fontSize: '2rem', fontWeight: 500 }}
      onClick={onClick} // 직접 onClick prop 사용
    >
      <span>{value}</span>
    </button>
  );
}

export default NumberButton;
