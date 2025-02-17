import { useEffect } from 'react';
import useFriendRequestStore from '@/stores/friendRequestStore';
import useSubAccountStore from '@/stores/subAccountStore';
import FriendRequestItem from './FriendRequestItem';

function FriendRequestList(): JSX.Element {
  const {
    requests,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    isLoading,
  } = useFriendRequestStore();
  const { selectedAccount } = useSubAccountStore();

  useEffect(() => { // 요청 목록 가져오기
    if (selectedAccount?.childId) {
      fetchRequests(selectedAccount.childId);
    }
  }, [selectedAccount?.childId]);

  if (!selectedAccount) {
    return <div>로그인된 계정이 없습니다.</div>;
  }

  const { childId } = selectedAccount;

  // 로딩 상태
  // const { isLoading } = useFriendRequestStore();
  if (isLoading) {
    return <div>요청 목록을 불러오는 중...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64 md:h-80 text-sm sm:text-base md:text-lg text-gray-500">
        <p className="text-gray-500">받은 친구 요청이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {requests.map((request) => (
        <FriendRequestItem
          key={request.friendId}
          request={request}
          onAccept={(friendId) => acceptRequest(childId, friendId)}
          onReject={(friendId) => rejectRequest(childId, friendId)}
        />
      ))}
    </div>
  );
}

export default FriendRequestList;
