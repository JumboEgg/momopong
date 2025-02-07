import { useState } from 'react';
import NumberPad from '@/components/common/numberpad/NumberPad';
import useAuthStore from '@/stores/authStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useFriendRequestStore from '@/stores/friendRequestStore';
import useSubAccountStore from '@/stores/subAccountStore';

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
  }; // 이 부분에 중괄호가 빠져있었습니다

  return (
    <div className="fixed top-0 left-0 w-full h-full z-30 bg-[#00000060] flex items-center justify-center">
      <div className="w-[750px] min-h-[490px] bg-[#FFF08E] border-10 border-white flex flex-col relative items-center justify-around p-4 rounded-[2vw] overflow-hidden">
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faXmark} size="lg" />}
          size="sm"
          variant="action"
          className="absolute top-4 left-4 z-35"
          onClick={onClose}
        />

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">친구 코드를 입력하세요</h2>
          <p className="bg-white px-4 py-2 rounded-lg min-w-[120px] min-h-10 text-xl">
            {friendCode}
          </p>
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error}</p>
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

export default AddFriendModal;
