// 프로필 선택 페이지
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import ProfileImage from '@/components/common/ProfileImage';

interface SubAccountGridProps {
  onAdd: () => void;
}

function SubAccountGrid({ onAdd }: SubAccountGridProps): JSX.Element {
  const navigate = useNavigate();

  const {
    subAccounts, loginSubAccount, fetchSubAccounts, isLoading, error, canAddMore,
  } = useSubAccountStore();

  const handleAccountSelect = async (childId: number) => {
    try {
      const isFirstLogin = await loginSubAccount(childId);

      // firstLogin값에 따라 튜토리얼 / home으로 이동하는 로직 추가 예정
      if (isFirstLogin) {
        navigate('/home'); // 이부분을 튜토리얼 시작으로 바꾸면 됩니다
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('로그인 실패:', err); // 추후 토스트로 바꾸는것 고려
    }
  };

  useEffect(() => {
    fetchSubAccounts();
  }, []); //  컴포넌트 마운트 시 데이터 조회

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-gray-500">로딩 중</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-red-500">
          에러:
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">계정 선택</h1>
      <div className="grid grid-cols-3 gap-4">
        {subAccounts.map((account) => (
          <button
            key={account.childId}
            type="button"
            onClick={() => navigate('/children/signup')}
            disabled={isLoading}
            className="aspect-square w-50 h-50 rounded-lg border-2 border-gray-200 p-4 flex flex-col items-center justify-center hover:border-blue-500 disabled:opacity-50"
          >
            <ProfileImage
              src={account.profile || '/default-profile.png'}
              alt={`${account.name}의 프로필`}
              size="lg"
              shape="square"
              onClick={() => handleAccountSelect(account.childId)}
            />
            <span className="font-medium text-gray-900">{account.name}</span>
          </button>
        ))}
        {canAddMore() && (
        <button
          type="button"
          onClick={onAdd}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500"
        >
          <span className="text-4xl text-gray-400">+</span>
        </button>
        )}
      </div>
    </div>
  );
}

export default SubAccountGrid;
