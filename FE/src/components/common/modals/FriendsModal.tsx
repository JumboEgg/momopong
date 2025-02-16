import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import FriendList from '@/components/friends/FriendList';
import FriendRequestList from '@/components/friends/FriendRequestList';
import AddFriendModal from './AddFriendModal';
import TextButton from '../buttons/TextButton';
import { IconCircleButton } from '../buttons/CircleButton';

interface FriendsModalProps {
  onClose: () => void;
}

type TabType = 'list' | 'request';

function FriendsModal({ onClose }: FriendsModalProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [focusedButton, setFocusedButton] = useState<TabType>('list');

  useEffect(() => {
    setFocusedButton('list');
    setActiveTab('list');
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFocusedButton(tab);
  };

  const handleOpenAddFriendModal = () => {
    setIsAddFriendModalOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-30
        bg-black/60
        flex items-center justify-center
        p-4 sm:p-6 md:p-8"
    >
      {/* 모달 영역 */}
      <div
        className="
          relative
          w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-1/2
          h-[80vh] min-h-[500px] sm:min-h-[550px] md:min-h-[600px]
          max-h-[600px] sm:max-h-[700px] md:max-h-[800px]
          bg-broom-200
          border-6 sm:border-8 md:border-10 border-tainoi-400
          rounded-[3vw] sm:rounded-[2.5vw] md:rounded-[2vw]
          flex flex-col
          p-3 sm:p-4 md:p-6 lg:p-8
          overflow-hidden
        "
      >
        {/* 닫기 버튼 */}
        <IconCircleButton
          size="xs"
          variant="action"
          className="
            absolute
            top-2 sm:top-3 md:top-4
            right-2 sm:right-3 md:right-4
            font-semibold
            z-10
          "
          onClick={onClose}
          icon={<FontAwesomeIcon icon={faX} size="lg" />}
        />

        {/* 탭 버튼 영역 */}
        <div className="
          relative
          flex justify-center
          space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10
          px-2 sm:px-3 md:px-4 lg:px-5
        "
        >
          <TextButton
            size="md"
            variant="white"
            hasFocus={focusedButton === 'list'}
            onClick={() => handleTabChange('list')}
          >
            친구 목록
          </TextButton>
          <TextButton
            size="md"
            variant="white"
            hasFocus={focusedButton === 'request'}
            onClick={() => handleTabChange('request')}
          >
            친구 요청
          </TextButton>
        </div>

        {/* Content Area */}
        <div className="
          flex-1
          w-full
          overflow-y-auto
          my-1 sm:my-1 md:my-2 lg:my-3
          px-2 sm:px-3 md:px-4
          customScrollbar yellow
        "
        >
          {activeTab === 'list' ? (
            <FriendList />
          ) : (
            <FriendRequestList />
          )}
        </div>

        {/* Add Friend Button */}
        <div className="
          mt-1 sm:mt-2 md:mt-3
          flex justify-center
        "
        >
          <TextButton
            size="lg"
            variant="rounded"
            onClick={handleOpenAddFriendModal}
          >
            친구 추가하기
          </TextButton>
        </div>

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
