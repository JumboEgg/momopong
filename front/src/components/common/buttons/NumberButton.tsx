import { ReactNode } from 'react';

interface NumberButtonProps {
  // value prop은 문자열 및 React 요소 모두 받아야 함
  value: string | ReactNode;
  onClick: (value: string) => void;
}

function NumberButton({ value, onClick }: NumberButtonProps) {
  const handleClick = () => {
    if (typeof value === 'string') {
      onClick(value);
    }
  };
  return (
    <button
      type="button"
      className="rounded-full
        bg-[#FCD34D] hover:bg-[#FFF781]
        border-8 border-[#FFB31A] hover:border-[#FFC95E]
        hover:text-gray-500
        flex items-center justify-center
        min-w-[75px] min-h-[75px]
        font-['KCC-Ganpan']"
      style={{ fontSize: '2rem', fontWeight: 500 }}
      onClick={handleClick}
    >
      <span>{value}</span>
    </button>
  );
}

export default NumberButton;
