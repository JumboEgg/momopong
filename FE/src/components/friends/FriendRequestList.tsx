import { useFriendRequestStore } from '@/stores/friendRequestStore';
import useSubAccountStore from '@/stores/subAccountStore';
import FriendRequestItem from './FriendRequestItem';

function FriendRequestList(): JSX.Element {
  const { requests, acceptRequest, rejectRequest } = useFriendRequestStore();
  const { selectedAccount } = useSubAccountStore();

  if (!selectedAccount) {
    return <div>로그인된 계정이 없습니다.</div>;
  }

  const { childId } = selectedAccount;

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
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
