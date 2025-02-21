import { useState } from 'react';
import NumberPad from '@/components/common/numberpad/NumberPad';
// import useAuthStore from '@/stores/authStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useFriendRequestStore from '@/stores/friendRequestStore';
import useSubAccountStore from '@/stores/subAccountStore';
import useToastStore from '@/stores/toastStore';
import PopText from '../PopText';

interface AddFriendModalProps {
  onClose: () => void;
}

function AddFriendModal({ onClose }: AddFriendModalProps): JSX.Element {
  const [friendCode, setFriendCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const toastStore = useToastStore();
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

    // console.log('Selected Account:', selectedAccount);
    // console.log('Current Token:', useAuthStore.getState().accessToken);

    try {
      await sendRequest(selectedAccount.childId, friendCode);
      onClose();
      toastStore.showToast({
        type: 'success',
        message: '친구 요청을 보냈습니다.',
      });
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
        w-[95%] sm:w-[85%] md:w-[%]
        max-w-[500px]
        bg-[#FFF08E]
        border-6 sm:border-8 md:border-10 border-white
        rounded-[3vw] sm:rounded-[2.5vw] md:rounded-[2vw]
        p-4 sm:p-6 md:p-8
      "
      >
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
          size="sm"
          variant="action"
          className="absolute top-4 left-4 z-35"
          onClick={onClose}
        />

        {/* height < 500px일 때 row, 그 외에는 column */}
        <div className="
          flex
          min-h-[400px]
          flex-col
          items-center
          gap-4
          [@media(max-height:500px)]:flex-row
          [@media(max-height:500px)]:items-center
          [@media(max-height:500px)]:justify-around
        "
        >
          {/* 왼쪽(또는 상단) 영역 */}
          <div className="
            flex flex-col items-center gap-2
            [@media(max-height:500px)]:w-1/2
          "
          >
            <PopText
              strokeWidth={2}
              strokeColor="white"
              className="text-tainoi-500 font-[BMJUA]"
              fontSize="text-lg sm:text-xl"
            >
              친구 코드를 입력하세요
            </PopText>

            <div className="
              w-[160px] sm:w-[180px]
              h-[36px] sm:h-[40px]
              bg-white rounded-lg
              flex items-center justify-center
              text-base sm:text-lg
              font-[BMJUA]
            "
            >
              {friendCode}
            </div>

            <div className="h-2 text-md text-red-500">
              {error}
            </div>
          </div>

          {/* 오른쪽(또는 하단) 영역 */}
          <div className="
            [@media(max-height:500px)]:w-1/2
            [@media(max-height:500px)]:scale-75
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
    </div>
  );
}
export default AddFriendModal;
