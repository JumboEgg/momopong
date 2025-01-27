import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberPad from '@/components/common/numberpad/NumberPad';

// 모달 컴포넌트
function ParentAuthModal(): JSX.Element {
  const navigate = useNavigate();

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
    setUserInput((prev) => prev.slice(0, -1));
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    const answer = parseInt(userInput, 10);
    const correct = answer === result;
    setIsCorrect(correct);

    if (correct) {
      navigate('/Parent'); // 정답일때 보호자 페이지로 이동
    } else {
      setUserInput(''); // 정답이 아닐 경우 입력값 초기화
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-[750px] min-h-[490px] bg-[#FFF08E] border-10 border-white
        flex items-center justify-around p-4 rounded-[2vw] overflow-hidden"
      >
        <div className="text-center mb-8">
          <h2>정답을 입력하세요</h2>
          <span>{num1}</span>
          <span>X</span>
          <span>{num2}</span>
          <span>= ?</span>
          <p className="bg-white px-4 py-2 rounded-lg min-w-[60px]">
            {userInput || '_'}
          </p>
          {isCorrect === false && (
            <p className="text-red-600">틀렸습니다. 다시 입력해주세요.</p>
          )}
        </div>

        <NumberPad
          onNumberClick={handleNumberClick}
          onSubmit={handleSubmit}
          onClear={handleClear}
        />
      </div>
    </div>
  );
}

export default ParentAuthModal;
