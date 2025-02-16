import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoadingPage() {
  const [dots, setDots] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 점(...) 애니메이션
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return '';
        return `${prev}.`;
      });
    }, 500);

    // 3초 후 홈으로 이동
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="w-screen h-screen">
      <div className="fixed bottom-0 w-full h-[30%] min-h-20 bg-gradient-to-t from-black to-transparent" />
      <img
        src="/images/loadingImages/background.jpeg"
        alt="loading"
        className="w-full h-full object-cover object-center"
      />
      <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA]">
        <span>동화나라로 이동하고 있어요</span>
        <span className="inline-block min-w-[3ch]">{dots}</span>
      </div>
    </div>
  );
}

export default LoadingPage;
