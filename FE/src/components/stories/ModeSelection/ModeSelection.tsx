import { useStory } from '@/stores/storyStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ModeSelection(): JSX.Element {
  const { setMode, bookId } = useStory();
  const { bookContent, setBookContent } = useBookContent();

  const handleModeSelection = async (mode: 'reading' | 'together') => {
    try {
      if (mode === 'together' && bookId) {
        setBookContent(bookId);
        const numericBookId = Number(bookId);

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
    <div className="h-full w-full bg-[#FCEDBA]">
      <div className="absolute mt-5 ml-5">
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={() => window.history.back()}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        />
      </div>
      <div className="h-full w-full flex items-center justify-evenly columns-2">
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => handleModeSelection('reading')}
              className="py-4 px-6 text-lg hover:text-2xl duration-200 font-semibold flex flex-col"
            >
              <div className="w-full max-w-xl min-w-40 self-center">
                <img
                  src="/images/icons/reading.png"
                  alt="reading mode"
                />
              </div>
              <div className="self-center">읽기 모드</div>
            </button>
          </div>
        </div>
        <div className="max-w-md flex justify-center">
          <div className="space-y-4 w-[80%] hover:w-full duration-200">
            <button
              type="button"
              onClick={() => handleModeSelection('together')}
              className="py-4 px-6 text-lg hover:text-2xl duration-200 font-semibold flex flex-col"
            >
              <div className="w-full max-w-xl min-w-40 self-center">
                <img
                  src="/images/icons/friendship.png"
                  alt="together mode"
                />
              </div>
              <div className="self-center">함께 읽기 모드</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
 }

 export default ModeSelection;
