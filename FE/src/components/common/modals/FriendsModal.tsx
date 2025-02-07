import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleOpenAddFriendModal = () => {
    setIsAddFriendModalOpen(true);
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-30
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-1/2 min-h-[85vh] bg-broom-200 border-10 border-tainoi-400
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
            hasFocus={activeTab === 'list'}
            onClick={() => handleTabChange('list')}
          >
            친구 목록
          </TextButton>
          <TextButton
            size="lg"
            variant="white"
            hasFocus={activeTab === 'request'}
            onClick={() => handleTabChange('request')}
          >
            친구 요청
          </TextButton>
        </div>
        {/* 탭으로 전환되는 부분 */}
        <div className="flex-1 w-full overflow-y-auto my-8">
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
