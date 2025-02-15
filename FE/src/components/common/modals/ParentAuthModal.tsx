// components/ParentAuthModal.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberPad from '@/components/common/numberpad/NumberPad';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useParentAuthStore } from '@/stores/parentAuthStore'; // 상태관리

interface ParentAuthModalProps {
  onClose: () => void; // onClose 함수를 받아올 Props
}

function ParentAuthModal({ onClose }: ParentAuthModalProps): JSX.Element {
  const navigate = useNavigate();
  const {
    userInput,
    isCorrect,
    numbers: { num1, num2 },
    setUserInput,
    clearLastInput,
    checkAnswer,
    resetAuth, // 문제 초기화
  } = useParentAuthStore();

    // 컴포넌트 마운트 시 상태 초기화
    useEffect(() => {
      resetAuth();
    }, [resetAuth]);

  const handleNumberClick = (value: number) => {
    setUserInput(value);
  };

  const handleSubmit = () => {
    const correct = checkAnswer();
    if (correct) {
      // 현재 페이지를 히스토리 스택에서 교체
      navigate('/Parent', { replace: true });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 bg-[#00000060] flex items-center justify-center">
      <div className="w-[750px] min-h-[490px] bg-[#FFF08E] border-10 border-white flex relative items-center justify-around p-4 rounded-[2vw] overflow-hidden">
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
          size="sm"
          variant="action"
          className="absolute top-4 left-4 z-35"
          onClick={onClose}
        />

        <div className="text-center mb-8">
          <h2>정답을 입력하세요</h2>
          <span>{num1}</span>
          <span>X</span>
          <span>{num2}</span>
          <span>= ?</span>
          <p className="bg-white px-4 py-2 rounded-lg min-w-[60px] min-h-10">
            {userInput}
          </p>
          {isCorrect === false && (
            <p className="text-red-600">틀렸습니다. 다시 입력해주세요.</p>
          )}
        </div>

        <NumberPad
          onNumberClick={handleNumberClick}
          onSubmit={handleSubmit}
          onClear={clearLastInput}
        />
      </div>
    </div>
  );
}

export default ParentAuthModal;
