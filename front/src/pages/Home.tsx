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
          className="navigation-button"
        >
          <img
            src="/images/profileicon.png"
            alt="프로필"
          />
          <p>프로필</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/friends')}
          className="navigation-button"
        >
          <img
            src="/images/friendsicon.png"
            alt="친구목록"
          />
          <p>친구목록</p>
        </button>
      </div>

      {/* Main Navigation Icons */}
      <div className="flex justify-center items-center" style={{ gap: '2rem' }}>
        <button
          type="button"
          onClick={() => handleNavigation('/drawing')}
          className="navigation-button main"
        >
          <img
            src="/images/crayonicon.png"
            alt="그림그리기"
          />
          <p>그림그리기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/story')}
          className="navigation-button main"
        >
          <img
            src="/images/bookicon.png"
            alt="동화읽기"
          />
          <p>동화읽기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/house')}
          className="navigation-button main"
        >
          <img
            src="/images/houseicon.png"
            alt="나의집"
          />
          <p>나의집</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
