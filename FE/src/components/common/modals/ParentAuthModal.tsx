import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberPad from '@/components/common/numberpad/NumberPad';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useParentAuthStore } from '@/stores/parentAuthStore';
import PopText from '../PopText';

interface ParentAuthModalProps {
  onClose: () => void;
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
    resetAuth,
  } = useParentAuthStore();

  useEffect(() => {
    resetAuth();
  }, [resetAuth]);

  const handleNumberClick = (value: number) => {
    setUserInput(value);
  };

  const handleSubmit = () => {
    const correct = checkAnswer();
    if (correct) {
      navigate('/Parent', { replace: true });
    }
  };

  return (
    // 백드롭
    <div className="
      fixed inset-0 z-30
      bg-black/60
      flex items-center justify-center
      p-4 sm:p-6 md:p-8
    "
    >
      {/* 모달 컨테이너 */}
      <div className="
        relative
        w-[95%] sm:w-[85%] md:w-[75%] lg:w-[750px]
        h-auto
        min-h-[350px] sm:min-h-[400px] md:min-h-[490px]
        max-h-[90vh]
        bg-[#FFF08E]
        border-6 sm:border-8 md:border-10 border-white
        rounded-[3vw] sm:rounded-[2.5vw] md:rounded-[2vw]
        flex flex-col sm:flex-row
        items-center justify-around
        p-4 sm:p-6 md:p-8
        gap-4 sm:gap-6 md:gap-8
        overflow-y-auto
      "
      >
        {/* 닫기 버튼 */}
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
          size="sm"
          variant="action"
          className="
            absolute
            top-2 sm:top-3 md:top-4
            left-2 sm:left-3 md:left-4
            z-35
          "
          onClick={onClose}
        />

        {/* 문제 및 입력 영역 */}
        <div className="
          text-center
          w-full sm:w-1/2
          mt-8 sm:mt-0
          space-y-4
        "
        >
          <h2 className="
            relative
            text-2xl sm:text-3xl md:text-4xl
            mb-4 sm:mb-6
            font-[BMJUA]
          "
          >
            <PopText
              strokeWidth={6}
              strokeColor="white"
              className="text-tainoi-500"
              fontSize="text-2xl sm:text-3xl md:text-4xl"
            >
              정답을 입력하세요
            </PopText>
          </h2>

          <div className="
            flex items-center justify-center
            font-[BMJUA]
            text-xl sm:text-2xl md:text-3xl
          "
          >
            <span>{num1}</span>
            <span>X</span>
            <span>{num2}</span>
            <span>=</span>
            <span>?</span>
          </div>

          <div className="
            bg-white
            px-4 py-2
            rounded-lg
            w-[120px]
            h-[50px]
            mx-auto
            text-xl sm:text-2xl md:text-3xl
            font-[BMJUA]
            flex items-center justify-center
            overflow-hidden
          "
          >
            {userInput}
          </div>

          {isCorrect === false && (
            <p className="
              text-red-600
              text-sm sm:text-base md:text-lg
              mt-2
            "
            >
              틀렸습니다. 다시 입력해주세요.
            </p>
          )}
        </div>

        {/* 숫자패드 영역 */}
        <div className="
          w-full sm:w-1/2
          flex justify-center
        "
        >
          <NumberPad
            onNumberClick={handleNumberClick}
            onSubmit={handleSubmit}
            onClear={clearLastInput}
          />
        </div>
      </div>
    </div>
  );
}

export default ParentAuthModal;
