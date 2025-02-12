// src/components/stories/StoryMode/StorySelection.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';

const stories = [
  {
    id: 1,
    title: '신데렐라',
    image: '/images/cinderella.jpg',
    ageRange: '5-7세',
  },
  {
    id: 2,
    title: '흥부놀부',
    image: '/images/heungbu.jpg',
    ageRange: '5-7세',
  },
  {
    id: 3,
    title: '백설공주',
    image: '/images/snowwhite.jpg',
    ageRange: '5-7세',
  },
  {
    id: 4,
    title: '인어공주',
    image: '/images/mermaid.jpg',
    ageRange: '5-7세',
  },
  {
    id: 5,
    title: '견우와 직녀',
    image: '/images/daily.jpg',
    ageRange: '5-7세',
  },
  {
    id: 6,
    title: '빨간망토',
    image: '/images/red-riding-hood.jpg',
    ageRange: '5-7세',
  },
];

function StorySelection(): JSX.Element {
  const navigate = useNavigate();
  const { setBookId, setTitle } = useStory();
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPrevious = () => {
    setStartIndex((current) => Math.max(0, current - 6));
  };

  const showNext = () => {
    setStartIndex((current) => Math.min(stories.length - 6, current + 6));
  };

  const handleStorySelect = (bookId: number) => { // storyId: string -> bookId: number
    try {
      setIsLoading(true);
      setError(null);
      // 스토리 ID 설정
      const selectedStory = stories.find((story) => story.id === bookId);
    if (selectedStory) {
      setBookId(bookId);
      setTitle(selectedStory.title); // title 저장 추가
      navigate('/story/ModeSelection');
    }
  } catch (err) {
    setError('스토리를 불러오는 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};
  // 홈으로 이동하는 경우만 navigate 사용
  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div className="w-[1600px] h-[1000px] flex flex-col px-[200px] bg-[url('/images/bookstand.jpg')] bg-cover bg-center">
      {/* 헤더 영역 */}
      <div className="h-14 px-8 pt-6">
        <button
          type="button"
          onClick={handleBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={20} />
          <span>뒤로가기</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mt-4">읽을 동화를 골라보아요</h1>

      {error && (
        <div className="mx-auto mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 캐러셀 컨테이너 */}
      <div className="flex items-center gap-4 px-20 flex-1 mb-16 pb-8">
        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={showPrevious}
          disabled={startIndex === 0 || isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full">
            <ChevronLeft size={20} />
          </div>
        </button>

        {/* 책 표지 그리드 */}
        <div className="flex-1 h-[750px] grid grid-rows-2 grid-cols-3 gap-x-4 gap-y-16 place-items-center">
          {stories.slice(startIndex, startIndex + 6).map((story) => (
            <button
              key={story.id}
              type="button"
              onClick={() => handleStorySelect(story.id)}
              disabled={isLoading}
              className="group relative perspective w-[280px] h-[350px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* 기존 책 UI 컴포넌트 */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg opacity-50" />
              <div className="w-[280px] h-[350px] preserve-3d transition-all duration-300 ease-out
                group-hover:rotate-y-12 group-hover:scale-105 group-hover:-translate-y-2
                group-hover:rotate-x-2"
              >
                {/* 책 앞면 */}
                <div className="absolute w-full h-full bg-white rounded-lg shadow-xl transform-style preserve-3d
                  rotate-y-3 bg-gradient-to-br from-white to-gray-50"
                >
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-lg opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 rounded-lg" />
                  <div className="absolute inset-0 rounded-lg ring-1 ring-black/5" />
                </div>

                {/* 책등 */}
                <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-r from-gray-200 to-gray-300
                  transform translate-x-full rotate-y-90 origin-left rounded-r-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/10" />
                  <div className="absolute inset-x-0 top-4 h-[1px] bg-gray-400/30" />
                  <div className="absolute inset-x-0 bottom-4 h-[1px] bg-gray-400/30" />
                </div>

                {/* 책 아래쪽 면 */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-b from-gray-200 to-gray-300
                  transform translate-y-full rotate-x-90 origin-top"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-black/20" />
                </div>
              </div>

              {/* 그림자 효과 */}
              <div className="absolute -bottom-4 left-1/2 w-4/5 h-4 bg-black/20 blur-lg transform -translate-x-1/2
                transition-all duration-300 group-hover:w-3/4 group-hover:h-6 group-hover:-bottom-6"
              />
            </button>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={showNext}
          disabled={startIndex >= stories.length - 6 || isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full">
            <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </div>
  );
}

export default StorySelection;
