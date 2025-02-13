import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDrawingHistory } from '@/stores/sketch/drawingHistoyStore';

function MyDrawing() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const {
    drawingList,
  } = useDrawingHistory();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : drawingList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < drawingList.length - 1 ? prev + 1 : 0));
  };

  const handleBack = () => {
    navigate('/house');
  };

  return (
    <div className="flex flex-col min-h-screen bg-yellow-100 p-8">
      {/* 뒤로가기 버튼 */}
      <IconCircleButton
        size="sm"
        variant="action"
        onClick={handleBack}
        icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        className="fixed top-2 md:top-5 left-2 md:left-5 z-10"
      />
      <ArrowLeft size={24} />

      {/* 메인 그림 영역 */}
      <div className="relative flex flex-col items-center justify-center flex-grow">

        {/* 이전 버튼 */}
        <button
          type="button"
          onClick={handlePrevious}
          className="absolute left-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
        >
          <ChevronRight size={24} />
        </button>

        {/* 제목 버튼 */}
        <div className="translate-y-2 md:translate-y-4">
          <div className="px-3 md:px-6 py-1 md:py-2 bg-yellow-300 rounded-full font-[BMJUA] text-xl md:text-2xl whitespace-nowrap">
            {drawingList.length ? drawingList[currentIndex].frameTitle : '아직 그림이 없어요'}
          </div>
        </div>

        {/* 그림 프레임 */}
        <div className="w-full max-w-[60%] md:max-w-[70%] lg:max-w-3xl aspect-video rounded-lg">
          <div className="w-full h-full outline-15 outline-amber-700 bg-gray-100 overflow-hidden rounded-xs shadow-2xl">
            {
              drawingList.length
                ? (
                  <img
                    src={drawingList[currentIndex].frameUrl}
                    alt={drawingList[currentIndex].frameTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  null
                )
            }

          </div>
        </div>
        <p className="text-center mt-8 text-gray-600 text-xl">
          {drawingList.length
            ? '좌우로 이동하며 내가 그린 그림들을 구경하세요!'
            : '그림을 그리거나 함께 동화를 읽으며 내가 그린 그림을 모아보세요!'}
        </p>
      </div>

      {/* 안내 텍스트 */}
      <img
        src="/images/icons/teddybearicon.png"
        alt="곰인형 장식"
        className="fixed -bottom-[10%] -right-3 w-[20%]"
      />
      <img
        src="/images/icons/planticon.png"
        alt="식물 장식"
        className="fixed -bottom-[10%] -left-3 w-[20%]"
      />
    </div>
  );
}

export default MyDrawing;
