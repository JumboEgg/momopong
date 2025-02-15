import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import FriendList from '@/components/friends/FriendList';
import FriendRequestList from '@/components/friends/FriendRequestList';
import AddFriendModal from './AddFriendModal';
import TextButton from '../buttons/TextButton';
import { IconCircleButton } from '../buttons/CircleButton';

interface FriendsModalProps {
  onClose: () => void; // onClose 함수를 받아올 Props
}

type TabType = 'list' | 'request';

function FriendsModal({ onClose }: FriendsModalProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [focusedButton, setFocusedButton] = useState<TabType>('list'); // 포커스 상태 추가

  // 컴포넌트 마운트 시 'list' 버튼에 포커스
  useEffect(() => {
    setFocusedButton('list');
    setActiveTab('list'); // activeTab도 함께 설정
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFocusedButton(tab);
  };

  const handleOpenAddFriendModal = () => {
    setIsAddFriendModalOpen(true);
  };

  return (
    // dim 처리 영역
    <div
      className="fixed top-0 left-0 w-full h-full z-30
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-[90%] md:w-1/2 h-[80vh] min-h-[600px] max-h-[800px] bg-broom-200 border-10 border-tainoi-400
      flex flex-col absolute items-center p-4 md:p-8 rounded-[2vw]"
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
            hasFocus={focusedButton === 'list'}
            onClick={() => handleTabChange('list')}
          >
            친구 목록
          </TextButton>
          <TextButton
            size="lg"
            variant="white"
            hasFocus={focusedButton === 'request'}
            onClick={() => handleTabChange('request')}
          >
            친구 요청
          </TextButton>
        </div>
        {/* 탭으로 전환되는 부분 */}
        <div className="flex-1 w-full overflow-y-auto my-4 md:my-8 px-2 md:px-4 customScrollbar yellow">
          {activeTab === 'list' ? (
            <FriendList />
          ) : (
            <FriendRequestList />
          )}
        </div>
        <TextButton
          size="xl"
          variant="rounded"
          onClick={handleOpenAddFriendModal}
        >
          친구 추가하기
        </TextButton>

        {isAddFriendModalOpen && (
          <AddFriendModal
            onClose={() => setIsAddFriendModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

export default FriendsModal;
