import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const drawings = [
  { id: 1, title: '신데렐라 왕자', image: '/api/placeholder/800/600' },
  { id: 2, title: '백설공주', image: '/api/placeholder/800/600' },
  { id: 3, title: '인어공주', image: '/api/placeholder/800/600' },
];

function MyDrawing() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : drawings.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < drawings.length - 1 ? prev + 1 : 0));
  };

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100 p-8">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 hover:bg-gray-100"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* 메인 그림 영역 */}
      <div className="relative flex items-center justify-center">
        {/* 제목 버튼 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="px-6 py-2 bg-yellow-300 rounded-full text-lg font-bold whitespace-nowrap">
            {drawings[currentIndex].title}
          </div>
        </div>

        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 그림 프레임 */}
        <div className="w-full max-w-4xl aspect-video bg-pink-200 rounded-xl p-4 shadow-lg">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={drawings[currentIndex].image}
              alt={drawings[currentIndex].title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-center mt-8 text-gray-600 text-xl">
        좌우로 이동하며 내가 그린 그림들을 구경하세요!
      </p>
    </div>
  );
}

export default MyDrawing;
