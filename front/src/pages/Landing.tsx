import { useNavigate } from 'react-router-dom';

function Landing(): JSX.Element {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/parents/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-2xl text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-8 leading-relaxed">
          혼자 읽는 동화는 이제 그만,
          <br />
          친구와 함께 만드는 우리들의 이야기
          <br />
          우리 아이의 특별한 소통 창구
          <br />
          동화누리
        </h1>
        <p className="text-lg text-white mb-8">시작하기 버튼을 눌러 새로운 경험을 시작하세요</p>
        <button
          type="button"
          onClick={handleStart}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold
                  hover:bg-blue-50 transition-colors duration-200 shadow-lg"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default Landing;
