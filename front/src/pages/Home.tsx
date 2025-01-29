import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    // 최상위 div에 p / m 옵션을 주면 상단이 비어버리니 주의합니다
    <div className="">
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={() => handleNavigation('/profile')}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src="/images/profileicon.png"
            alt="프로필"
            style={{ width: '50px', height: '50px' }}
            className="w-8 h-8 rounded-lg"
          />
          <p className="text-center text-xs">프로필</p>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/friends')}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src="/images/friendsicon.png"
            alt="친구목록"
            style={{ width: '50px', height: '50px' }}
            className="w-8 h-8 rounded-lg"
          />
          <p className="text-center text-xs">친구목록</p>
        </button>
      </div>

      <div className="flex justify-center items-center gap-4 mb-2 flex-row">
        <button
          type="button"
          onClick={() => handleNavigation('/drawing')}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src="/images/crayonicon.png"
            alt="그림그리기"
            style={{ width: '100px', height: '100px' }}
            className="w-12 h-12 rounded-lg"
          />
          <p className="text-center text-xs mt-1">그림그리기</p>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/story')}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src="/images/bookicon.png"
            alt="동화읽기"
            style={{ width: '100px', height: '100px' }}
            className="w-12 h-12 rounded-lg"
          />
          <p className="text-center text-xs mt-1">동화읽기</p>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/house')}
          className="cursor-pointer flex flex-col items-center"
        >
          <img
            src="/images/houseicon.png"
            alt="나의집"
            style={{ width: '100px', height: '100px' }}
            className="w-12 h-12 rounded-lg"
          />
          <p className="text-center text-xs mt-1">나의집</p>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/test')}
          className="cursor-pointer flex flex-col items-center"
        >
          <p className="text-center text-xs mt-1 border-2">테스트</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
