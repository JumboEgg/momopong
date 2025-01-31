import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigation = (path: '/profile' | '/friends' | '/drawing' | '/story' | '/house'): void => {
    navigate(path);
  };

  return (
    <div className="min-h-screen p-2">
      {/* Top Navigation Icons */}
      <div className="flex justify-between mb-6">
        <button
          type="button"
          onClick={() => handleNavigation('/profile')}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0"
        >
          <img
            src="/images/profileicon.png"
            alt="프로필"
            className="w-8 h-8 object-contain"
          />
          <p className="text-xl mt-0.5">프로필</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/friends')}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0"
        >
          <img
            src="/images/friendsicon.png"
            alt="친구목록"
            className="w-8 h-8 object-contain"
          />
          <p className="text-xl mt-0.5">친구목록</p>
        </button>
      </div>

      {/* Main Navigation Icons */}
      <div className="flex justify-center items-center gap-12">
        <button
          type="button"
          onClick={() => handleNavigation('/drawing')}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0"
        >
          <img
            src="/images/crayonicon.png"
            alt="그림그리기"
            className="w-16 h-16 object-contain"
          />
          <p className="text-xl mt-0.5">그림그리기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/story')}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0"
        >
          <img
            src="/images/bookicon.png"
            alt="동화읽기"
            className="w-16 h-16 object-contain"
          />
          <p className="text-xl mt-0.5">동화읽기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/house')}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0"
        >
          <img
            src="/images/houseicon.png"
            alt="나의집"
            className="w-16 h-16 object-contain"
          />
          <p className="text-xl mt-0.5">나의집</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
