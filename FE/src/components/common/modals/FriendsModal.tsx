import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
// import { useState } from 'react';
import FriendList from '@/components/friends/FriendList';
import TextButton from '../buttons/TextButton';
import { IconCircleButton } from '../buttons/CircleButton';

interface FriendsModalProps {
  onClose: () => void; // onClose 함수를 받아올 Props
}
function FriendsModal({ onClose }: FriendsModalProps): JSX.Element {
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-30
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-1/2 min-h-[85vh] bg-[#FFF08E] border-10 border-tainoi-400
        flex flex-col absolute items-center justify-between p-8 rounded-[2vw] overflow-hidden"
      >
        <IconCircleButton
          size="xs"
          variant="action"
          className="absolute top-4 right-4 font-semibold"
          onClick={onClose}
          icon={<FontAwesomeIcon icon={faX} size="lg" />}
        />
        <div className="relative space-x-10 top-5">
          <TextButton
            size="lg"
            variant="white"
            hasFocus
          >
            친구 목록
          </TextButton>
          <TextButton
            size="lg"
            variant="white"
            hasFocus
          >
            친구 요청
          </TextButton>
        </div>
        <div className="">
          <FriendList />
        </div>
        <TextButton
          size="xl"
          variant="rounded"
          // onClick={handleOpenModal}
        >
          친구 추가하기
        </TextButton>

        {/* {isModalOpen && (d)} */}
      </div>
    </div>
  );
}

export default FriendsModal;
