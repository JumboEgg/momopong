// src/components/stories/StoryMode/StorySelection.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useBookList } from '@/stores/bookListStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faArrowLeft, faCaretLeft, faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { getCoverPath } from '@/utils/format/imgPath';

function StorySelection(): JSX.Element {
  const {
    bookList,
  } = useBookList();
  const navigate = useNavigate();
  const { setBookId } = useStory();
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showPrevious = () => {
    setStartIndex((current) => Math.max(0, current - 6));
  };

  const showNext = () => {
    setStartIndex((current) => Math.min(bookList.length - 6, current + 6));
  };

  const handleStorySelect = (bookId: number) => { // storyId: string -> bookId: number
    try {
      setIsLoading(true);
      setError(null);
      // 스토리 ID 설정
      setBookId(bookId); // setStoryId -> setBookId
      console.log('선택된 bookId:', bookId); // 디버깅용 로그 추가
      navigate('/story/ModeSelection'); // 추천: 선택 후 스토리 모드로 이동
    } catch (err) {
      setError('스토리를 불러오는 중 오류가 발생했습니다.');
      console.error('스토리 선택 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-green-900 flex items-center justify-center">
      <div className="absolute top-5 left-5 z-10">
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={() => navigate('/home')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
          className=""
        />
      </div>

      <div className="absolute top-5 md:top-10 flex justify-center w-full font-[BMJUA] text-3xl z-0 text-yellow-100">
        읽을 동화를 골라보세요
      </div>

      <IconCircleButton
        size="sm"
        variant="action"
        className="fixed top-1/2 left-5 z-10"
        onClick={showPrevious}
        icon={<FontAwesomeIcon icon={faCaretLeft} size="sm" />}
      />

      <IconCircleButton
        size="sm"
        variant="action"
        className="fixed top-1/2 right-5 z-10"
        onClick={showNext}
        icon={<FontAwesomeIcon icon={faCaretRight} size="sm" />}
      />

      {/* 책장 */}
      <div className="relative w-[90%] mt-20 min-w-xl max-w-5xl h-[80vh] bg-yellow-700 rounded-2xl p-8 flex items-center justify-center overflow-hidden">
        {/* 선반 컨테이너 */}
        <div className="absolute inset-0 flex flex-col justify-evenly items-center p-8">
          {/* 상단 선반 */}
          <div className="w-full h-[45%] bg-yellow-800 rounded-2xl flex items-end px-6">
            <div className="w-full grid grid-cols-3 gap-x-6">
              {bookList.slice(startIndex, startIndex + 3).map((book) => (
                <button
                  key={book.bookId}
                  type="button"
                  onClick={() => handleStorySelect(book.bookId)}
                  disabled={isLoading}
                  className="group relative w-full aspect-4/3 transform-gpu transition-transform duration-300 hover:scale-105 origin-bottom"
                >
                  <img
                    src={getCoverPath(book.bookPath)}
                    alt={book.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute -bottom-4 left-1/2 w-4/5 h-4 bg-black/20 blur-lg -translate-x-1/2" />
                </button>
              ))}
            </div>
          </div>

          {/* 하단 선반 */}
          <div className="w-full h-[45%] bg-yellow-800 rounded-2xl flex items-end px-4">
            <div className="w-full grid grid-cols-3 gap-x-6">
              {bookList.slice(startIndex + 3, startIndex + 6).map((book) => (
                <button
                  key={book.bookId}
                  type="button"
                  onClick={() => handleStorySelect(book.bookId)}
                  disabled={isLoading}
                  className="group relative w-full aspect-4/3 transform-gpu transition-transform duration-300 hover:scale-105 origin-bottom"
                >
                  <img
                    src={getCoverPath(book.bookPath)}
                    alt={book.title}
                    className="w-full h-full object-cover rounded"
                  />
                  <div className="absolute -bottom-4 left-1/2 w-4/5 h-4 bg-black/20 blur-lg -translate-x-1/2" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default StorySelection;
