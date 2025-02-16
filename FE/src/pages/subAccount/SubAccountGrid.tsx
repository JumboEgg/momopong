import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import ProfileImage from '@/components/common/ProfileImage';
import PopText from '@/components/common/PopText';

interface SubAccountGridProps {
  onAdd: () => void;
}

function SubAccountGrid({ onAdd }: SubAccountGridProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null); // 추가
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const getOpacity = (selected: number | null, currentId: number) => {
    if (selected === null) return 1;
    if (selected === currentId) return 1;
    return 0.5;
  };

  const {
    subAccounts, loginSubAccount, fetchSubAccounts, isLoading, error, canAddMore,
  } = useSubAccountStore();

  const handleAccountSelect = async (childId: number) => {
    try {
      setSelectedId(childId);

      // Promise를 직접 생성하지 않고, setTimeout만 사용
      setTimeout(async () => {
        const isFirstLogin = await loginSubAccount(childId);

        if (isFirstLogin) {
          navigate('/home');
        } else {
          navigate('/home');
        }
      }, 400);
    } catch (err) {
      console.error('로그인 실패:', err);
      setSelectedId(null);
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
    <div
      ref={containerRef}
      className={`
        p-6 transition-opacity duration-300
        ${selectedId !== null ? 'opacity-90' : ''}
      `}
    >
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6 font-[BMJUA] text-">
          <PopText
            strokeWidth={10}
            strokeColor="white"
            className="text-blue-ribbon-400 font-[BMJUA]"
            fontSize="text-4xl md:text-5xl"
          >
            계정 선택
          </PopText>
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {subAccounts.map((account) => (
            <div
              className="relative transform transition-all duration-300 ease-out"
              key={account.childId}
              style={{
              transform: selectedId === account.childId ? 'scale(1.05)' : 'scale(1)',
              opacity: getOpacity(selectedId, account.childId),
            }}
            >
              <ProfileImage
                src={account.profile || '/default-profile.png'}
                alt={`${account.name}의 프로필`}
                size="lg"
                shape="square"
                onClick={() => handleAccountSelect(account.childId)}
                className={`
                  rounded-lg border-5 border-white
                  transition-all duration-300
                  hover:shadow-lg hover:scale-[1.02]
                  ${selectedId === account.childId ? 'ring-4 ring-pink-200' : ''}
                `}
              />
              <div
                className={`
          absolute top-2 left-0 right-0 
          flex justify-center
          transition-opacity duration-300
          ${selectedId !== null && selectedId !== account.childId ? 'opacity-50' : ''}
        `}
              >
                <PopText
                  strokeWidth={8}
                  strokeColor="white"
                  textColor="black"
                  fontSize="xl"
                  className="bottom-4 font-[BMJUA]"
                >
                  {account.name}
                </PopText>
              </div>
            </div>
  ))}
          {canAddMore() && (
          <button
            type="button"
            onClick={onAdd}
            className="aspect-square w-65 h-65 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500"
          >
            <span className="text-4xl text-gray-400 font-[BMJUA]">+</span>
          </button>
        )}
        </div>
      </div>
    </div>
  );
}

export default SubAccountGrid;
