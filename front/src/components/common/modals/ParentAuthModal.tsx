import { useState } from 'react';
import NumberPad from '@/components/common/numberpad/NumberPad';

interface Props {
  onSuccess: () => void; // 정답일 때 호출될 콜백함수
}

// 모달 컴포넌트
function NumModal({ onSuccess }: Props): JSX.Element {
  const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
  const [num1] = useState(getRandom(1, 10));
  const [num2] = useState(getRandom(1, 10));
  const [userInput, setUserInput] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const result = num1 * num2;

  const handleNumberClick = (value:number) => {
    if (userInput.length < 2) {
      setUserInput((prev) => prev + value);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    const answer = parseInt(userInput, 10);
    const correct = answer === result;
    setIsCorrect(correct);

    if (correct) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-[750px] min-h-[510px] bg-[#FFF08E]
      flex items-center justify-around p-4 rounded-[2vw] overflow-hidden"
    >
      <div className="text-center mb-8">
        <h2>정답을 입력하세요</h2>
        <span>{num1}</span>
        <span>X</span>
        <span>{num2}</span>
        <span>= ?</span>
        <span className="bg-white px-4 py-2 rounded-lg min-w-[60px]">
          {userInput || '_'}
        </span>
        {isCorrect === false && (
          <p className="text-red-600">틀렸습니다. 다시 시도해주세요.</p>
        )}
      </div>

      <NumberPad
        onNumberClick={handleNumberClick}
        onSubmit={handleSubmit}
        onClear={handleClear}
      />
    </div>
  );
}

export default NumModal;
