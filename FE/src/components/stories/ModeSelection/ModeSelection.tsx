import { useStory } from '@/stores/storyStore';
import { useBookContent } from '@/stores/book/bookContentStore';

function ModeSelection(): JSX.Element {
  const { setMode, bookId } = useStory(); // bookId가 여기서 제대로 있는지 확인
  const { bookContent, setBookContent } = useBookContent();

  console.log('ModeSelection bookId:', bookId); // 디버깅용

  const handleModeSelection = async (mode: 'reading' | 'together') => {
    try {
      if (mode === 'together' && bookId) {
        await setBookContent(bookId);
        // bookId를 숫자로 확실하게 변환
        const numericBookId = Number(bookId);
        console.log('Setting content with bookId:', numericBookId); // 디버깅용

        window.history.replaceState({
          contentId: numericBookId,
          contentType: 'BOOK',
          contentTitle: bookContent?.bookTitle,
        }, '');
      }
      setMode(mode);
    } catch (error) {
      console.error('Error in mode selection:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          {bookContent?.bookTitle || '동화'}
        </h1>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => handleModeSelection('reading')}
            className="py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            읽기 모드
          </button>
          <button
            type="button"
            onClick={() => handleModeSelection('together')}
            className="py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
          >
            함께 읽기 모드
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;
