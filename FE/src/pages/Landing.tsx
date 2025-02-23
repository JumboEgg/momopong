import { useNavigate } from 'react-router-dom';
import {
 useCallback, useEffect, useRef, useState,
} from 'react';
import useAuthStore from '@/stores/authStore';

interface PageProps {
  id: string;
  children: React.ReactNode;
}

interface ScrollContainerProps {
  children: React.ReactNode;
}

function Page({ id, children }: PageProps): JSX.Element {
  return (
    <div id={id} className="w-[100vw] h-[100vh] scroll-page">
      {children}
    </div>
  );
}

function ScrollContainer({ children }: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const lastPage = useRef<number>(0);

  const getCurrentPage = (idx: number) => Math.min(lastPage.current, Math.max(0, idx));

  const moveToPage = (nextPage: number) => {
    const container = containerRef.current;
    if (container) {
      // Apply the transform for smooth scrolling
      container.style.transition = 'transform 1s ease-in-out';
      container.style.transform = `translateY(-${nextPage * 100}vh)`;
      setPage(nextPage);
    }
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (isScrolling) return;
      setIsScrolling(true);

      // 페이지 이동 로직
      setTimeout(() => setIsScrolling(false), 1000);

      let nextPage = page;
      // 스크롤 시 현재 페이지 idx 증감
      if (event.deltaY > 0) nextPage += 1;
      else if (event.deltaY < 0) nextPage -= 1;
      nextPage = getCurrentPage(nextPage);

      moveToPage(nextPage);
    },
    [page, isScrolling],
  );

  // Swipe logic
  const [touchStart, setTouchStart] = useState<number>(0);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchStartY = event.touches[0].clientY;
    setTouchStart(touchStartY);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const touchEndY = event.changedTouches[0].clientY;

    if (isScrolling) return;

    setIsScrolling(true);
    // 페이지 이동 로직
    setTimeout(() => setIsScrolling(false), 1000);

    let nextPage = page;
    if (touchStart - touchEndY > 50) nextPage += 1; // swipe down
    else if (touchEndY - touchStart > 50) nextPage -= 1; // swipe up

    nextPage = getCurrentPage(nextPage);
    moveToPage(nextPage);
  };

  useEffect(() => {
    if (containerRef.current) {
      const pages = [...containerRef.current.querySelectorAll('.scroll-page')];
      lastPage.current = pages.length - 1;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-[100vw] h-[100vh] top-0 transition-700 scroll-smooth scroll-container"
    >
      {children}
    </div>
  );
}

function Landing(): JSX.Element {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { user } = useAuthStore();

  const handleStart = () => {
    navigate('/parents/login');
  };

  useEffect(() => {
    // 인증된 사용자는 서브계정 선택 페이지로 리다이렉션
    if (isAuthenticated) {
      navigate(`/parents/${user?.parentId}/children`);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden">
      <ScrollContainer>
        <Page id="page1">
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[aliceblue] to-[skyblue]">
            <img
              src="/images/pageImg/landingPage.png"
              alt="loading"
              className="fixed w-full h-full object-cover object-center"
            />
            <div className="max-w-2xl text-center px-4 z-10">
              <h1 className="text-2xl text-blue-950 mb-8 leading-relaxed space-y-3">
                {/* <span>혼자 읽는 동화는 이제 그만!</span> */}
                {/* <br /> */}
                <div className="font-[KCC-Ganpan]">함께 만드는 우리들의 이야기</div>
                {/* <br /> */}
                {/* <span>우리 아이의 특별한 소통 창구</span> */}
                <div className="text-6xl font-[GeekbleMalang2WOFF2]">😸모모퐁😺</div>
              </h1>
              <p className="text-lg text-blue-900 mb-8">시작하기 버튼을 눌러 새로운 경험을 시작하세요</p>
              <button
                type="button"
                onClick={handleStart}
                className="px-8 py-3 bg-white rounded-lg font-semibold
                  hover:bg-blue-50 transition-colors duration-200 shadow-lg"
              >
                시작하기
              </button>
            </div>
          </div>
          <canvas className="page1Canvas fixed w-full h-full" />
        </Page>
        <Page id="page2">
          <div className="w-full h-full">
            <img
              src="/images/pageImg/landingPage2.png"
              alt="loading"
              className="fixed w-full h-full object-cover object-center"
            />
            <div className="relative h-full flex flex-col items-center justify-center z-10">
              <div className="text-3xl text-yellow-900 mb-8 leading-relaxed space-y-3 font-[BMJUA]">
                우리 모모퐁은
              </div>
              <div className="space-y-5 items-center justify-center text-yellow-950">
                <div className="flex space-x-10">
                  <div className="text-3xl font-[BMJUA] flex flex-col items-center justify-center">
                    다양한 동화책
                    <img
                      src="/images/pageImg/bookListImg.png"
                      alt="모모퐁 보유 동화책 목록"
                      className="h-[30vh] mt-2"
                    />
                  </div>
                  <div className="text-3xl font-[BMJUA] flex flex-col items-center justify-center">
                    수많은 색칠놀이
                    <img
                      src="/images/pageImg/templateListImg.png"
                      alt="모모퐁 보유 동화책 목록"
                      className="h-[30vh] mt-2"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-2xl items-center justify-center font-[BMJUA]">
                  <span>이 모든 걸 다시 볼 수 있는 리포트까지</span>
                  <img
                    src="/images/pageImg/reportImg.png"
                    alt="어린이 활동 리포트 화면"
                    className="h-[30vh] mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Page>
        <Page id="page3">
          <div className="w-full h-full">
            <img
              src="/images/pageImg/landingPage3.png"
              alt="loading"
              className="fixed w-full h-full object-cover object-center"
            />
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div className="text-2xl text-green-900 font-[BMJUA]">
                언제 어디서나 친구들과 함께할 수 있는 곳,
              </div>
              <div className="text-3xl text-green-900 font-[BMJUA]">
                모모퐁에서 새로운 여행을 떠나보세요
              </div>
              <img
                src="/images/pageImg/readingImg.png"
                alt="동화를 함께 읽는 장면"
                className="w-[70vw] mt-3"
              />
            </div>
          </div>
        </Page>
      </ScrollContainer>
    </div>
  );
}

export default Landing;
