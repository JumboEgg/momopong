import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';

const stories = [
  {
    id: 'cinderella',
    title: '신데렐라',
    image: '/images/cinderella.jpg',
    ageRange: '5-7세',
  },
  {
    id: 'heungbu',
    title: '흥부놀부',
    image: '/images/heungbu.jpg',
    ageRange: '5-7세',
  },
  {
    id: 'snow-white',
    title: '백설공주',
    image: '/images/snowwhite.jpg',
    ageRange: '5-7세',
  },
  {
    id: 'mermaid',
    title: '인어공주',
    image: '/images/mermaid.jpg',
    ageRange: '5-7세',
  },
  {
    id: 'daily',
    title: '견우와 직녀',
    image: '/images/daily.jpg',
    ageRange: '5-7세',
  },
  {
    id: 'red-riding-hood',
    title: '빨간망토',
    image: '/images/red-riding-hood.jpg',
    ageRange: '5-7세',
  },
];

function StorySelection(): JSX.Element {
  const navigate = useNavigate();
  const {
    setStoryId,
  } = useStory();

  const [startIndex, setStartIndex] = useState(0);
  // 동화 선택 캐러셀
  const showPrevious = () => {
    setStartIndex((current) => Math.max(0, current - 3));
  };

  const showNext = () => {
    setStartIndex((current) => Math.min(stories.length - 3, current + 3));
  };

  return (
    <div className="bg-[#FCEDBA] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft size={24} />
          <span>뒤로가기</span>
        </button>

        <h1 className="text-2xl font-bold mb-8">읽을 동화를 골라보아요</h1>

        {/* 캐러셀 컨테이너 */}
        <div className="flex items-center gap-8">
          {/* 이전 버튼 */}
          <button
            type="button"
            onClick={showPrevious}
            disabled={startIndex === 0}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full">
              <ChevronLeft size={24} />
            </div>
          </button>

          {/* 책 표지 그리드 */}
          <div className="flex justify-center gap-16">
            {stories.slice(startIndex, startIndex + 3).map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setStoryId(story.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow w-[180px]"
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-[240px] object-cover" // 높이를 240px로 고정
                />
              </button>
            ))}
          </div>

          {/* 다음 버튼 */}
          <button
            type="button"
            onClick={showNext}
            disabled={startIndex >= stories.length - 3}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 bg-purple-600 text-white flex items-center justify-center rounded-full">
              <ChevronRight size={24} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StorySelection;
