import { useState } from 'react';
import NumberPad from '@/components/common/numberpad/NumberPad';
import useAuthStore from '@/stores/authStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useFriendRequestStore from '@/stores/friendRequestStore';
import useSubAccountStore from '@/stores/subAccountStore';
import PopText from '../PopText';

interface AddFriendModalProps {
  onClose: () => void;
}

function AddFriendModal({ onClose }: AddFriendModalProps): JSX.Element {
  const [friendCode, setFriendCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { sendRequest } = useFriendRequestStore();
  const { selectedAccount } = useSubAccountStore(); // 현재 로그인한 자식 정보

  const handleNumberClick = (value: number) => {
    if (friendCode.length < 8) {
      setFriendCode((prev) => prev + value.toString());
      setError('');
    }
  };

  const clearLastInput = () => {
    setFriendCode((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = async () => {
    if (friendCode.length !== 8) {
      setError('친구 코드는 8자리여야 합니다.');
      return;
    }

    if (!selectedAccount?.childId) {
      setError('로그인이 필요합니다.');
      return;
    }

    console.log('Selected Account:', selectedAccount);
    console.log('Current Token:', useAuthStore.getState().accessToken);

    try {
      await sendRequest(selectedAccount.childId, friendCode);
      onClose();
      alert('친구 요청을 보냈습니다!');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('친구 요청에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/60 flex items-center justify-center p-4">
      <div className="
        relative
        w-[95%] sm:w-[85%] md:w-[75%] lg:w-[750px]
        bg-[#FFF08E]
        border-6 sm:border-8 md:border-10 border-white
        rounded-[3vw] sm:rounded-[2.5vw] md:rounded-[2vw]
        flex flex-col
        p-6 sm:p-8 md:p-10
      "
      >
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
          size="sm"
          variant="action"
          className="absolute top-4 left-4 z-35"
          onClick={onClose}
        />

        {/* flex-grow나 flex-1 제거하고 고정된 마진 사용 */}
        <div className="flex flex-col items-center">
          {/* 상단 영역 */}
          <PopText
            strokeWidth={2}
            strokeColor="white"
            className="text-tainoi-500 mb-8 font-[BMJUA]"
            fontSize="text-2xl sm:text-3xl md:text-4xl"
          >
            친구 코드를 입력하세요
          </PopText>

          {/* 입력창 */}
          <div className="
            w-[200px] sm:w-[220px] md:w-[240px]
            h-[44px] sm:h-[48px] md:h-[52px]
            bg-white rounded-lg
            flex items-center justify-center
            text-lg sm:text-xl md:text-2xl
            font-[BMJUA]
            mb-4  // 고정 마진
          "
          >
            {friendCode}
          </div>

          {/* 에러 메시지 */}
          <div className="
            h-6
            text-xs sm:text-sm
            text-red-500
            mb-2  // 고정 마진
          "
          >
            {error}
          </div>

          {/* 넘버패드 */}
          <div>
            <NumberPad
              onNumberClick={handleNumberClick}
              onSubmit={handleSubmit}
              onClear={clearLastInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;
